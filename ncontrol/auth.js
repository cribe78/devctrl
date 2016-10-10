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
var http = require("http");
var url = require("url");
var debugMod = require("debug");
var mongo = require("mongodb");
var debug = debugMod("auth");
var Auth = (function () {
    function Auth() {
    }
    ;
    Auth.prototype.run = function (config) {
        var _this = this;
        this.config = config;
        this.app = http.createServer(function (req, response) {
            _this.httpHandler(req, response);
        });
        this.app.listen(config.authPort);
        // Connect to mongodb
        var mongoConnStr = "mongodb://" + config.mongoHost + ":" + config.mongoPort
            + "/" + config.mongoDB;
        var self = this;
        mongo.MongoClient.connect(mongoConnStr, function (err, db) {
            if (!err) {
                debug("mongodb connected");
                self.mongodb = db;
            }
            else {
                debug("error: mongodb connect failed: " + err.message);
            }
        });
        this.app.listen(config.ioPort);
    };
    Auth.getIdentifier = function (req) {
        var cookies = {};
        if (req.headers['cookie']) {
            var cstrs = req.headers['cookie'].split(';');
            for (var _i = 0, cstrs_1 = cstrs; _i < cstrs_1.length; _i++) {
                var cstr = cstrs_1[_i];
                var _a = cstr.split("="), name_1 = _a[0], value = _a[1];
                cookies[name_1.trim()] = value;
            }
        }
        if (cookies["identifier"]) {
            return cookies["identifier"];
        }
        return '';
    };
    Auth.prototype.httpHandler = function (req, response) {
        var _this = this;
        var parts = url.parse(req.url);
        var sessions = this.mongodb.collection("sessions");
        debug("http request: " + parts.pathname);
        if (req.method != 'GET') {
            this.errorResponse(response, 405, req.method + " not supported");
            return;
        }
        var identifier = Auth.getIdentifier(req);
        // /admin_auth location should be protected by the proxying webserver
        // authorization will be granted to any user who hits the location
        if (parts.pathname == '/admin_auth') {
            if (!identifier) {
                this.errorResponse(response, 400, "Don't come here without a session");
                return;
            }
            var adminExpires = Date.now() + (1000 * 600); // 10 minutes from now
            var loginExpires = parseInt(req.headers['oidc_claim_exp']) * 1000;
            var session = {
                login_expires: loginExpires,
                auth: true,
                admin_auth: true,
                admin_auth_expires: adminExpires,
                username: req.headers["oidc_claim_preferred_username"]
            };
            sessions.findOneAndUpdate({ _id: identifier }, { '$set': session }, { returnOriginal: false }, function (err, r) {
                if (err) {
                    _this.errorResponse(response, 503, "mongodb error: " + err.message);
                    return;
                }
                if (r.value) {
                    response.setHeader('Content-Type', 'application/json');
                    response.writeHead(200);
                    response.end(JSON.stringify({ session: r.value }));
                }
                else {
                    _this.errorResponse(response, 503, "failed to update user session");
                }
            });
            return;
        }
        else if (parts.pathname == '/do_logon') {
            if (!identifier) {
                this.errorResponse(response, 400, "Don't come here without a session");
                return;
            }
            var admin_auth_requested = false;
            if (parts.query['admin_auth_requested']) {
                admin_auth_requested = true;
            }
            var loginExpires = parseInt(req.headers['oidc_claim_exp']) * 1000;
            sessions.findOneAndUpdate({ _id: identifier }, { '$set': {
                    login_expires: loginExpires,
                    auth: true,
                    admin_auth_requested: admin_auth_requested,
                    username: req.headers["oidc_claim_preferred_username"]
                } }, function (err, doc) {
                if (err) {
                    _this.errorResponse(response, 503, "mongodb error: " + err.message);
                    return;
                }
                // Redirect to the location specified in the query string
                if (doc.value) {
                    var location_1 = '/';
                    if (parts.query.location) {
                        location_1 = parts.query.location;
                    }
                    response.setHeader('Location', location_1);
                    response.writeHead(302);
                    response.end();
                }
                else {
                    // No session found
                    _this.errorResponse(response, 400, "Session not found for identifier " + identifier);
                }
            });
            return;
        }
        else if (parts.pathname == '/user_session') {
            // This endpoint returns the current user session or creates a new one if necessary
            var idProvided = true;
            if (!identifier) {
                idProvided = false;
                identifier = (new mongo.ObjectID()).toString();
            }
            if (idProvided) {
                sessions.findOne({ _id: identifier }, function (err, doc) {
                    if (err) {
                        _this.errorResponse(response, 503, "mongodb error: " + err.message);
                        return;
                    }
                    if (doc) {
                        var session = doc;
                        response.writeHead(200);
                        response.end(JSON.stringify({ session: session }));
                    }
                    else {
                        // No session found
                        _this.errorResponse(response, 400, "Session not found for identifier " + identifier);
                    }
                });
            }
            else {
                // New session
                var session_1 = {
                    _id: identifier,
                    login_expires: 0,
                    auth: false,
                    admin_auth: false,
                    admin_auth_expires: 0
                };
                if (req.headers['x-forwarded-for']) {
                    session_1.client_name = req.headers['x-forwarded-for'];
                }
                if (req.headers["oidc_claim_preferred_username"]) {
                    session_1.username = req.headers["oidc_claim_preferred_username"];
                }
                sessions.insertOne(session_1, function (err, result) {
                    if (err) {
                        _this.errorResponse(response, 503, "mongodb error: " + err.message);
                        return;
                    }
                    var oneYear = 1000 * 3600 * 24 * 365;
                    var cookieExpire = new Date(Date.now() + oneYear);
                    var expStr = cookieExpire.toUTCString();
                    var idCookie = "identifier=" + identifier + ";expires=" + expStr + ";path=/";
                    response.setHeader('Set-Cookie', [idCookie]);
                    response.writeHead(200);
                    response.end(JSON.stringify({ session: session_1 }));
                });
            }
            return;
        }
        debug("api call to " + req.url + " unhandled");
        response.writeHead(500);
        response.end("unhandled api call");
    };
    Auth.prototype.errorResponse = function (res, code, message) {
        res.writeHead(code);
        res.end(message);
        debug("error: " + message);
    };
    return Auth;
}());
var auth = new Auth();
module.exports = auth;
//# sourceMappingURL=auth.js.map