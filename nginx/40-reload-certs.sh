#!/bin/sh
while :; do sleep 21600; nginx -s reload; done &
