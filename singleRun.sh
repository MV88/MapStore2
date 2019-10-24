#!/bin/bash
#
#

set -e

START_TIME=$SECONDS
echo "started at $START_TIME"

npm test

ELAPSED_TIME=$(($SECONDS - $START_TIME))

echo "***************************************************"
echo "$(($ELAPSED_TIME/60)) min $(($ELAPSED_TIME%60)) sec"
