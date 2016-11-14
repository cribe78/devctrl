#!/usr/bin/env node
"use strict";

/**
 * DevCtrl Authorization Overview
 *
 * The default security implementation is based on the Apache OpenID Connect module (auth_oidc)
 * with the intention that this can be swapped out for another Apache auth module as needed
 *
 * In-application authentication is implemented via an "identifier" cookie, whose value is matched
 * against authorization information in the database.
 *
 * Authorization is provided by protected authorization endpoints.  When the server configuration
 * allows a user access to one of these endpoints, authorization is granted.  There are 2 authorization
 * levels: user and admin.  User authorization is permanent - to allow access to be granted to a specific
 * device without requiring user credentials.  Admin authorization is temporary.
 *
 *
 * Endpoints:
 *   user_session - XHR, no auth required, returns sessions details associated with identifier
 *
 *   do_logon - potentially redirects to login page if server auth page does not recognize user. Otherwise
 *   sets "login_expires" timestamp and redirects to original location. Protected by same authorization
 *   requirements as user_auth
 *
 *   user_auth - XHR, set user auth flag if endpoint is reached.  Access denied error should result in
 *   message to user - ?? WHY DOES THIS ENDPOINT EXIST, do_logon should set user_auth??
 *
 *   admin_auth - XHR, set admin auth flag and timeout value if endpoint is reached.  Admin UI elements
 *   should be disabled if access is denied
 *
 *
 *  Admin Auth workflow
 *   When a user requests admin authorization, we need to know whether the server will recognize them.
 *   If not, XHR requests to the auth_admin endpoint will be redirected to a login page. Check the
 *   user_session login_expires timestamp.  If not expired, send the XHR request to admin_auth.  If
 *   expired, send user to do_logon with check_admin_auth flag set.
 *
 *
 *
 *
 * Not logged in, new user:
 *   - hit user_session => new session, with auth = false and logged_in = false, returned
 *   - display login dialog
 *   - Set location to user_auth, with current location parameter
 *   - user_auth updates user info, sets auth = true redirects to original location
 *
 * Not logged in, previously authorized:
 *   - hit user_session => session, with auth = true, returned
 *
 * Admin action requested, not logged in:
 *   - display login dialog
 *   - Set location to user_auth, with current location parameter
 *   - user_auth updates user info, sets auth = true redirects to original location
 *
 * Admin action requested, logged in:
 *   - if session.admin_auth && session not expired, go ahead
 *   - hit admin_auth => get updated UserSession
 *   - if admin_auth == true, go ahead
 *   - if error, "You Can't Do That"
 *
 */

import * as http from "http";
import * as url from "url";
import * as debugMod from "debug";
import * as mongo from "mongodb";
import * as querystring from "querystring";
import {UserSession} from "./shared/UserSession";

let debug = debugMod("auth");

class Auth {
    app : http.Server;
    config: any;
    mongodb: mongo.Db;
    sessions: mongo.Collection;

    constructor() {};

    run(config: any) {
        this.config = config;
        this.app = http.createServer((req, response) => {
            this.httpHandler(req, response);
        });
        this.app.listen(config.authPort);

        // Connect to mongodb
        let mongoConnStr = "mongodb://" + config.mongoHost + ":" + config.mongoPort
            + "/" + config.mongoDB;

        let self = this;
        mongo.MongoClient.connect( mongoConnStr, function(err, db) {
            if (! err) {
                debug("mongodb connected");
                self.mongodb = db;
                self.sessions = db.collection("sessions");
            }
            else {
                debug("error: mongodb connect failed: " + err.message);
            }
        });

        this.app.listen(config.ioPort);

    }

    static getIdentifier(req: http.IncomingMessage) : string {
        let cookies = {};

        if (req.headers['cookie']) {
            let cstrs = req.headers['cookie'].split(';');

            for (let cstr of cstrs) {
                let [name, value] = cstr.split("=");
                cookies[name.trim()] = value;
            }
        }

        if (cookies["identifier"]) {
            return cookies["identifier"];
        }

        return '';
    }


    adminAuth(req: http.IncomingMessage, response: http.ServerResponse, identifier: string) {
        if (! identifier) {
            this.errorResponse(response, 400, "Don't come here without a session");
            return;
        }

        let adminExpires = Date.now() + (1000 * 120); // 2 minutes from now
        let expDate = new Date(adminExpires);
        let expStr = expDate.toTimeString();

        debug("admin expiration set to " + expStr);
        let loginExpires = parseInt(req.headers['oidc_claim_exp']) * 1000;


        let session : UserSession = {
            login_expires: loginExpires,
            auth: true,
            admin_auth: true,
            admin_auth_expires: adminExpires,
            admin_auth_requested: false,
            username: req.headers["oidc_claim_preferred_username"]
        };


        this.sessions.findOneAndUpdate({ _id : identifier }, { '$set' : session },
            { returnOriginal: false},
            (err, r) => {
                if (err) {
                    this.errorResponse(response, 503, "mongodb error: " + err.message);
                    return;
                }

                if (r.value) {
                    debug("auth_requested set to " + r.value.admin_auth_requested);
                    response.setHeader('Content-Type', 'application/json');
                    response.writeHead(200);
                    response.end(JSON.stringify({ session: r.value}));
                }
                else {
                    this.errorResponse(response, 503, "failed to update user session");
                }
            }
        );
    }

    createEndpointSession(req: http.IncomingMessage, response: http.ServerResponse) {
        let  identifier = (new mongo.ObjectID()).toString();

        let parts = url.parse(req.url);
        let clientName = parts.query;

        // New session
        let session : UserSession = {
            _id: identifier,
            login_expires: 0,
            auth: true,
            admin_auth: true,
            admin_auth_expires: -1,
            client_name: clientName
        };


        if (req.headers["oidc_claim_preferred_username"]) {
            session.username = req.headers["oidc_claim_preferred_username"];
        }

        this.sessions.insertOne(session, (err, result) => {
            if (err) {
                this.errorResponse(response, 503, "mongodb error: " + err.message);
                return;
            }

            response.writeHead(200);
            response.end(JSON.stringify({ session: session}));
        });

    }

    doLogon(req: http.IncomingMessage, response: http.ServerResponse, identifier: string) {
        if (! identifier) {
            this.errorResponse(response, 400, "Don't come here without a session");
            return;
        }

        let parts = url.parse(req.url);
        let queryVars = querystring.parse(parts.query);

        let admin_auth_requested = false;
        if (queryVars['admin_auth_requested']) {
            admin_auth_requested = true;
        }

        debug("do_logon, admin_auth_requested = " + admin_auth_requested);

        let loginExpires = parseInt(req.headers['oidc_claim_exp']) * 1000;

        this.sessions.findOneAndUpdate({ _id: identifier},
            { '$set' : {
                login_expires : loginExpires,
                auth: true,
                admin_auth_requested: admin_auth_requested,
                username: req.headers["oidc_claim_preferred_username"]
            }},
            (err, doc) => {
                if (err) {
                    this.errorResponse(response, 503, "mongodb error: " + err.message);
                    return;
                }

                // Redirect to the location specified in the query string
                if (doc.value) {
                    let location = '/';
                    if (queryVars.location) {
                        location = queryVars.location;
                    }

                    debug(`logon complete, redirecting to ${location}, aar=${admin_auth_requested}`);

                    response.setHeader('Location', location);
                    response.writeHead(302);
                    response.end();
                }
                else {
                    // No session found
                    this.errorResponse(response, 400, "Session not found for identifier " + identifier);
                }
            }
        );
    }

    httpHandler(req: http.IncomingMessage, response: http.ServerResponse ) {
        let parts = url.parse(req.url);
        let sessions = this.mongodb.collection("sessions");
        debug(`http request: ${parts.pathname}`);

        if (req.method != 'GET') {
            this.errorResponse(response, 405, `${req.method} not supported`);
            return;
        }

        let identifier = Auth.getIdentifier(req);


        if (parts.pathname == '/admin_auth') {
            /**
             * admin_auth location should be protected by the proxying webserver
             * authorization will be granted to any user who hits the location
             */

            this.adminAuth(req, response, identifier);
            return;
        }
        else if (parts.pathname == '/create_endpoint_session') {
            /**
             * This endpoint requires the same protection as the admin_auth endpoint
             * https://devctrl.dwi.ufl.edu/auth/create_endpoint_session?endpoint-name
             */
            this.createEndpointSession(req, response);
            return;
        }
        else if (parts.pathname == '/do_logon') {
            /**
             * This endpoint should be protected.  Only users authorized to access the application
             * should be able to access it
             */
            this.doLogon(req, response, identifier);
            return;
        }
        else if (parts.pathname == '/user_session') {
            this.userSession(req, response, identifier);
            return;
        }
        else if (parts.pathname == '/revoke_admin') {
            this.revokeAdminAuth(req, response, identifier);
            return;
        }

        debug(`api call to ${req.url} unhandled`);
        response.writeHead(500);
        response.end("unhandled api call");
    }


    errorResponse(res: http.ServerResponse, code: number, message: string) {
        res.writeHead(code);
        res.end(message);

        debug(`error: ${message}`);
    }


    revokeAdminAuth(req: http.IncomingMessage, response: http.ServerResponse, identifier: string) {
        // This endpoint sets removes the admin auth from the session
        // Additional actions will be required to ensure that users cannot regain admin auth
        // without resupplying credentials
        if (! identifier) {
            this.errorResponse(response, 400, "Don't come here without a session");
            return;
        }

        let adminExpires = Date.now(); // now
        let loginExpires = parseInt(req.headers['oidc_claim_exp']) * 1000;


        let session : UserSession = {
            login_expires: loginExpires,
            auth: true,
            admin_auth: false,
            admin_auth_expires: adminExpires,
            admin_auth_requested: false,
            username: req.headers["oidc_claim_preferred_username"]
        };


        this.sessions.findOneAndUpdate({ _id : identifier }, { '$set' : session },
            { returnOriginal: false},
            (err, r) => {
                if (err) {
                    this.errorResponse(response, 503, "mongodb error: " + err.message);
                    return;
                }

                if (r.value) {
                    debug("auth_requested set to " + r.value.admin_auth_requested);
                    response.setHeader('Content-Type', 'application/json');
                    response.writeHead(200);
                    response.end(JSON.stringify({ session: r.value}));
                }
                else {
                    this.errorResponse(response, 503, "failed to update user session");
                }
            }
        );
    }


    userSession(req: http.IncomingMessage, response: http.ServerResponse, identifier: string) {
        // This endpoint returns the current user session or creates a new one if necessary
        let idProvided = true;

        if (! identifier) {
            idProvided = false;
            identifier = (new mongo.ObjectID()).toString();
        }

        if (idProvided) {
            this.sessions.findOne({ _id: identifier}, (err, doc) => {
                if (err) {
                    this.errorResponse(response, 503, "mongodb error: " + err.message);
                    return;
                }

                if (doc) {
                    let session:UserSession = (<UserSession>doc);
                    response.writeHead(200);
                    response.end(JSON.stringify({ session: session }));
                }
                else {
                    // No session found
                    this.errorResponse(response, 400, "Session not found for identifier " + identifier);
                }
            });
        }
        else {
            // New session
            let session : UserSession = {
                _id: identifier,
                login_expires: 0,
                auth: false,
                admin_auth: false,
                admin_auth_expires: 0
            };

            if (req.headers['x-forwarded-for']) {
                session.client_name = req.headers['x-forwarded-for'];
            }

            if (req.headers["oidc_claim_preferred_username"]) {
                session.username = req.headers["oidc_claim_preferred_username"];
            }

            this.sessions.insertOne(session, (err, result) => {
                if (err) {
                    this.errorResponse(response, 503, "mongodb error: " + err.message);
                    return;
                }

                let oneYear = 1000 * 3600 * 24 * 365;
                let cookieExpire = new Date(Date.now() + oneYear);
                let expStr = cookieExpire.toUTCString();
                let idCookie = `identifier=${identifier};expires=${expStr};path=/`;

                response.setHeader('Set-Cookie', [idCookie]);
                response.writeHead(200);
                response.end(JSON.stringify({ session: session}));
            });
        }
    }
}

let auth = new Auth();
module.exports = auth;