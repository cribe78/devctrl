#!/usr/bin/perl

# swusb-mon
# Monitor the serial connection to an Extron SW4 USB switch
# and forward input switch events to a the Extron HDMI switcher


use English;
use Getopt::Long;
use IO::Socket::INET;
use LWP::UserAgent;
use JSON;
use HTTP::Cookies;
use POSIX;
use Scalar::Util qw( looks_like_number );
use Sys::Syslog;
use Time::HiRes qw( usleep time );
use feature 'state';
use warnings;
use strict;

$|++;

my $device_ip = "10.5.162.232";
my $device_port = 28844;
my $controller_ip = "controller.dwi.ufl.edu";
my $client_identifier = "identifier";
my @controls = ();
my $scaler_control = 263;
my $debug = 1;
my $daemon = 1;
my $dxp_dest = 6;
my $cookie_file = "/var/www/html/devctrl.dwi.ufl.edu/pcontrol/.cookies.txt";

my %options = ("sw4-ip=s" => \$device_ip,
            "sw4-port=i" => \$device_port,
            "controller=s" => \$controller_ip,
            "identifier=s" => \$client_identifier,
            "debug" => \$debug,
            "daemon!" => \$daemon,
            "controls=s" => \@controls,
            "scaler-control" => \$scaler_control,
            "cookie-file=s" => \$cookie_file);

my %input_map;
for (my $i = 1; $i <= 4; $i++ ) {
   $input_map{"$i"} = $i;
   $options{"input$i=i"} = \$input_map{"$i"};
}

# Use a seperate map for selecting scaler input
# G = HDMI, C = DVI 
my %input_map_scaler = (
	"1" => "G",
	"2" => "G",
	"3" => "G",
	"4" => "C"
);


GetOptions(%options);

my @control_ids = split(/,/, join(',', @controls));

if ($daemon) {        
    # Daemonize
    # Get ready to daemonize by redirecting our output to syslog,
    # requesting that logger prefix the lines with our program name:
    my $ProgramName = "swusb-mon";
    open(STDOUT, "|-", "logger -p local2.info -t $ProgramName")
        or die("Couldn't open logger output stream: $!\n");
    open(STDERR, ">&STDOUT") or die("Couldn't redirect STDERR to STDOUT: $!\n");


    chdir('/'); # Avoid the possibility of our working directory resulting in keeping an otherwise unused filesystem in use

    # Double-fork to avoid leaving a zombie process behind:
    my $pid;
    defined($pid = fork()) or die "can't fork: $!";

    if ($pid) {
        exit;
    }

    defined($pid = fork()) or die "can't fork: $!";
    if ($pid) {
        exit;
    };

    print "$ProgramName $$ successfully daemonized\n";
    openlog($ProgramName,"pid","local2");

}

# Print a log message before exiting on SIGTERM
$SIG{TERM} = sub {
    dwlog("received SIGTERM.  exiting");
    exit();
};

my $conn_closed = 0;
$SIG{PIPE} = sub {
    dwlog("recieved SIGPIPE, doing something?");
    $conn_closed = 1;
};

my $cookie_jar = HTTP::Cookies->new( file => $cookie_file);

if ($client_identifier ne "identifier") {
	$cookie_jar->set_cookie(1, "identifier", $client_identifier, "/", $controller_ip, "443", 0, 0, 3600 * 24 *365, 0);
	$cookie_jar->save();
}

run();

sub device_connect {
    my $sock = 0;
    while (! $sock) {
    	$sock = IO::Socket::INET->new(
                PeerAddr => $device_ip,
                PeerPort => $device_port,
                Proto => 'tcp',
                Blocking => 0,
                Timeout => 5);
        
        if (! $sock) {
        	dwlog("could not open socket to device, retry in 10s");
        	sleep 10;
        }
    }

    dwlog("connected to $device_ip:$device_port");

    return $sock;
}


sub dwdebug {
    my ($msg) = (@_);
    if ($debug) {
        dwlog($msg);
    }
}


# Send log messages to the database and syslog

sub dwlog {
    my ($msg) = (@_);
    chomp $msg;

    if ($daemon) {
        syslog("info", "$device_port $msg");
    }
    else {
        print "$msg\n";
    }
}

sub run {
    my $sw_sock = device_connect();
    my $last_kicked = 0;
    MAIN_LOOP: while (1) {
        if (time() - $last_kicked > 10) {
            $sw_sock->print("I");
            $last_kicked = time();
        }

        my $msg = telnet_read($sw_sock);

        if ($conn_closed) {
            dwlog("device connection closed, reopening");
            $sw_sock->close();
            $sw_sock = device_connect();
            $conn_closed = 0;
        }

        if ($msg) {
            dwdebug("msg read: $msg");

            if ($msg =~ /InACT/) {
                # This is a response to an information request, don't act on it
            }
            elsif ($msg =~ /Chn(\d)/) {
                select_dxp_source($input_map{$1});
                select_scaler_source($input_map_scaler{$1});
            }
            else {
                # Ask for clarification
                dwdebug("You're breaking up SWUSB4, come again?");
                $sw_sock->print("I");
            }
        }
    }

    print "how on earth did we get here?\n";
}


# Send a pcontrol command to the controller, which will route it on 
# towards the HDMI switcher

sub select_dxp_source {
    my ($source) = (@_);
    
    my $ua = LWP::UserAgent->new;
    $ua->cookie_jar($cookie_jar);
    
    my $control_id;
    foreach $control_id (@control_ids) {
    	my $resp = $ua->put("https://$controller_ip/control.php/$control_id", Content => "{'value':$source}");
    	
    	if ($resp->code != 200) {
    		my $code = $resp->code;
    		dwlog("unexpected response code ($code) recieved from $controller_ip");
    	}
    	else {
        	my $json = $resp->decoded_content();
	    	my $jref = decode_json($json);
	    	my %jhash = %$jref;
	    	
	    	if ($jhash{error}) {
	    		dwlog("error setting control $control_id : {$jhash{error}} ");
	    	}
    	}

    }
    
    dwlog("source $source selected");
    return;
}

# Send a pcontrol command to the controller, which will route it on 
# towards the scaler

sub select_scaler_source {
    my ($source) = (@_);
    
    my $ua = LWP::UserAgent->new;
    $ua->cookie_jar($cookie_jar);
    

    my $resp = $ua->put("https://$controller_ip/control.php/$scaler_control", Content => "{'value':\"$source\"}");
    	
    if ($resp->code != 200) {
    	my $code = $resp->code;
    	dwlog("unexpected response code ($code) recieved from $controller_ip");
    }
    else {
       	my $json = $resp->decoded_content();
	   	my $jref = decode_json($json);
	   	my %jhash = %$jref;
	    	
	   	if ($jhash{error}) {
	   		dwlog("error setting scaler control $scaler_control : {$jhash{error}} ");
	   	}
    }

   
    
    dwlog("source $source selected");
    return;
}



sub telnet_read {
    my ($sock) = (@_);

    my $buf;
    my $res = "";
    my $wait_us = 10000;

    my $char_missed = 0;

    while (1) {
        if ($sock->read($buf, 1)) {
            if ($buf eq "\r") {
                $sock->read($buf, 1);
                return $res;
            }
            elsif ($buf eq "\x1A") {
                dwdebug("0x1A read after " . length($res) . " bytes");
                return $res;
            }
            elsif (length($res) == 0 && $buf eq "\x0A" ) {
                $buf = "";
            }

            $res .= $buf;
            $char_missed = 0;
        }
        else {
            if ($char_missed) {
                chomp $res;
                return $res;
            }
            else {
                $char_missed = 1;
                usleep($wait_us);
            }
        }
    }
}

