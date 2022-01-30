#!/usr/bin/env bash

function myrebase() {
    git fetch --all && git checkout release-0.3 && git rebase upstream/main && git push upstream
}

cd move2kube
myrebase
cd -

cd move2kube-api
myrebase
cd -

cd move2kube-ui
myrebase
cd -

cd move2kube-operator
myrebase
cd -

cd move2kube-tests
myrebase
cd -

cd move2kube-demos
myrebase
cd -

cd move2kube-transformers
myrebase
cd -
