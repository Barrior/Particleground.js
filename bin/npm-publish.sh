#!/bin/bash

echo "publish start..."

git checkout master

cat NPMREADME.md > README.md

npm adduser

npm publish

git checkout .

echo "publish done."
