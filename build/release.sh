#!/bin/bash

print_error() {
  printf "\e[31m${1} \e[0m"
}

print_info() {
  printf "\e[34m${1} \e[0m"
}

echo "✨ $(print_info 'Publishing...')"

readonly BRANCH_NAME=$(git symbolic-ref HEAD --short)

if [[ BRANCH_NAME != "master" ]]
  then
    print_error "error"
    echo "Publish command running only on the master branch, please checkout it."
    exit 1
fi

yarn build

yarn test

if [[ $? != 0 ]]
  then exit 1
fi

cat NPM_README.md > README.md

yarn login

yarn publish

git checkout .

print_info "✨ Publish done.\n"
