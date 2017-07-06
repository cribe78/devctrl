# DevCtrl #

DevCtrl is a web application and node backend for controlling and monitoring a collection of serial and 
networked devices.  Originally developed as an aid for using the 5 screen projection system in the 
[Digital Worlds PICT](http://digitalworlds.ufl.edu/institute-information/facilities/), it has since been expanded to 
control projectors, scalers, audio and video switchers, cameras, audio mixers, and other equipment.  It has been designed
 to make it easy to incorporate any class of device that exposes a serial or network control interface.  


### Getting started ###

Clone this repository
 
`$git clone git@bitbucket.org:ufdwi/devctrl.git`

Install node dependencies in the project directory

`npm install`

MongoDB is used as the data store for the project

`sudo apt-get install mongodb`

The application backend consists of multiple components. See [wiki](/ufdwi/devctrl/wiki/Components) for details. 

### Application Structure ###

Devctrl consists of several components:
 
* PHP application
* MySQL database 
* MongoDB database
* Node.js messenger server
* Perl pcontrol-daemon 
* Angular.js frontend 

* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

Typings:  typings is used to get TypeScript type definitions for JavaScript modules

See https://github.com/typings/typings for usage information. 



### Contribution guidelines ###

* Nothing here yet

### Who do I talk to? ###

DevCtrl is developed by Chris Ribe for the [Digital Worlds Institute](http://digitalworlds.ufl.edu) at the University of 
Florida