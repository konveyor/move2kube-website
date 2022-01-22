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

repo='move2kube-transformers'
unset dir
zip_flag="false"

print_usage() {
  printf "Usage: ./download.sh -d <dir> -r <repo>"
  printf "use -z if output is required as zip"
  printf ""
}

while getopts 'r:d:z' flag; do
  case "${flag}" in
    r) repo="${OPTARG}" ;;
    d) dir="${OPTARG}" ;;
    z) zip_flag="true" ;;
    *) print_usage
       exit 1 ;;
  esac
done

if [ -z "$dir" ] 
then
    curl -Lo ${repo}.zip https://github.com/konveyor/${repo}/archive/refs/heads/main.zip 
    unzip ${repo}.zip "${repo}-main/*"
    mv "${repo}-main/" "${repo}"
    rm -rf ${repo}.zip
    rm -rf "${repo}-main"
    if [ $zip_flag == "true" ] 
    then 
        zip -r ${repo}.zip ${repo}/
        rm -rf "${repo}"
    fi
else
    base_dir=${dir##*/}
    curl -Lo ${repo}.zip https://github.com/konveyor/${repo}/archive/refs/heads/main.zip 
    unzip ${repo}.zip "${repo}-main/$dir/*"
    mv "${repo}-main/$dir" "${base_dir}"
    rm -rf ${repo}.zip
    rm -rf "${repo}-main"
    if [ $zip_flag == "true" ] 
    then 
        zip -r ${base_dir}.zip ${base_dir}/
        rm -rf "${base_dir}"
    fi
fi
