#!/usr/bin/env bash

#   Copyright IBM Corporation 2022
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#        http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

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
