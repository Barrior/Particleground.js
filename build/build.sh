#!/bin/bash

DIRNAME=$(cd "$(dirname "$0")"; pwd)
DIR_LIB=$DIRNAME/../lib
DIR_BROWSER=$DIRNAME/../browser
DIR_SRC=$DIRNAME/../src
DIR_TYPES=$DIRNAME/../src/types

# clear build directories
rm -rf $DIR_BROWSER $DIR_LIB

# generate iife files for browser
npx rollup -c ./build/rollup.config.js

# generate cjs files for nodejs
npx ttsc -p $DIRNAME/../tsconfig.build.json

# copy types directory
cp -r $DIR_TYPES $DIR_LIB

# insert global type declaration into index.d.ts
REF_TYPE="/// <reference path=\"types/global.d.ts\" />"

sed -i '' -e '1i\'$'\n'"$REF_TYPE" $DIR_LIB/index.d.ts
