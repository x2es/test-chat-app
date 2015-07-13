#!/bin/bash

pushd ../backend > /dev/null
node --stack-size=1000000 ./echo-server-raw-ws.js 9999 &
PID_ECHO_SERVER=$!
echo "echo server pid: ${PID_ECHO_SERVER}"
popd > /dev/null

wstest -m fuzzingclient

echo
echo "========================"
echo
echo Success
node json-filter.js reports/servers/index.json AutobahnPython.*.behavior="OK" behavior,behaviorClose

echo Failed
node json-filter.js reports/servers/index.json AutobahnPython.*.behavior="FAILED" behavior,behaviorClose

echo
echo "========================"
echo

kill ${PID_ECHO_SERVER}

echo
echo "Checkout test results in: reports/servers/index.html"
echo
