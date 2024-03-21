#!/bin/bash
PARAM=$1
DEBUG=$2

usage() {
	echo "Usage: $0 <start|stop|restart|status> [DEBUG]"
	exit 1
}

# Use a different name for app.js
# If running more than one node project on the same OS, all started via "node app.js",
# then it helps to keep process command unique by using a name other than app.js .
# For example, symlink unique name to app.js, like gphotos.js: ln -s app.js gphotos.js
# This will not require any changes to git, but can now start app.js via "node gphotos.js"
APP=gphotos.js

# no matter where called from, run from same dir as this script
MYDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
LOGFILE=$MYDIR/node.log
ERRORS=0
CUR_PID=''

getCurPID() {
	CUR_PID=`ps aux|grep "node ${APP}"|grep -v grep|awk '{print $2}'`
}

checkConfig() {
	ORIG_CONFIG=$(grep 'ADD YOUR CLIENT ID' "${MYDIR}/config.js");
	if [[ "$ORIG_CONFIG" != "" ]]; then
		echo "ERROR: You need to customize $MYDIR/config.js ";
		ERRORS=$((ERRORS+1))
	else
		echo "config.js has been customized, ok to continue.";
	fi

	if [[ "$(node -v|grep 'v[2-4][0-9]')" != "" ]]; then
		echo "node version 20 or higher detected, $(node -v), ok to continue.";
	else
		echo "ERROR: node version should be 20 or higher, node = $(node -v)";
		echo "nvm use 20"
		ERRORS=$((ERRORS+1))
	fi
}

status() {
	if [[ "$CUR_PID" != "" ]]; then
		echo "node ${APP} is running as $CUR_PID";
	else
		echo "node ${APP} is not running, could not find PID.";
	fi
}

stopPID() {
	if [[ "$CUR_PID" != "" ]]; then
		echo "node ${APP} is running as $CUR_PID, stopping ...";
		kill $CUR_PID
	else
		echo "node ${APP} is not running, could not find PID.";
	fi
}

start() {
	if [[ "$CUR_PID" != "" ]]; then
		echo "node ${APP} is already running as $CUR_PID, doing nothing.";
		exit 0
	fi
	if [ "$ERRORS" -ne "0" ]; then
		echo "Will not start till ERRORs are fixed."
		exit 1
	fi
	echo "node ${APP} not running, attempting to start, see logfile: $LOGFILE";

	redirectAllOutputToLogfile
	echo ""
	echo "Starting node ${APP}"	
	if [[ "$DEBUG" =~ ^(DEBUG|debug)$ ]]; then
		cd $MYDIR && DEBUG=TRUE node ${APP} &
	else
		cd $MYDIR &&            node ${APP} &
	fi

	sleep 1
	getCurPID
	if [[ "$CUR_PID" != "" ]]; then
		echo "Started node ${APP} in $MYDIR as PID=$CUR_PID";
		exit 0;
	else
		echo "Trouble starting node ${APP}";
		exit 1;
	fi
}

redirectAllOutputToLogfile() {
	# redirects stderr and stdout to same place (exec &>) then add timestamp, then append to LOGFILE
	exec &> >(while read line; do echo "$(date +'%Y-%m-%dT%H:%M:%S.%3N%z-%a') $line" >> $LOGFILE; done;)
}

getCurPID
case "$PARAM" in
	stop)    stopPID ;;
	status)  checkConfig; status ;;
	restart) checkConfig; stopPID; sleep 1; getCurPID; start ;;
	start)   checkConfig; start ;;
    *) usage ;;
esac
