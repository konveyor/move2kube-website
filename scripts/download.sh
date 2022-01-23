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
unset outputdir
zip_flag="false"

print_usage() {
  printf "Usage: ./download.sh -d <dir> -r <repo> -o <outputdir>"
  printf "use -z if output is required as zip"
  printf ""
}

while getopts 'r:d:o:z' flag; do
  case "${flag}" in
    r) repo="${OPTARG}" ;;
    d) dir="${OPTARG}" ;;
    o) outputdir="${OPTARG}" ;;
    z) zip_flag="true" ;;
    *) print_usage
       exit 1 ;;
  esac
done

if [ ! -z "$outputdir" ] 
then
  mkdir -p $outputdir
  cd $outputdir
fi

if [ -z "$dir" ] 
then
  curl -Lo ${repo}.zip https://github.com/konveyor/${repo}/archive/refs/heads/main.zip 
  unzip -q ${repo}.zip "${repo}-main/*"
  rm -rf ${repo}.zip
  rm -rf "${repo}"
  mv "${repo}-main/" "${repo}"
  rm -rf "${repo}-main"
  if [ $zip_flag == "true" ] 
  then 
    zip -q -r ${repo}.zip ${repo}/
    rm -rf "${repo}"
    echo ${PWD}/${repo}.zip created
  else 
    echo ${PWD}/${repo} created
  fi
else
  base_dir=${dir##*/}
  curl -Lo ${repo}.zip https://github.com/konveyor/${repo}/archive/refs/heads/main.zip 
  unzip -q ${repo}.zip "${repo}-main/$dir/*"
  rm -rf ${repo}.zip
  rm -rf "${base_dir}"
  mv "${repo}-main/$dir" "${base_dir}"
  rm -rf "${repo}-main"
  if [ $zip_flag == "true" ] 
  then 
    zip -q -r ${base_dir}.zip ${base_dir}/
    rm -rf "${base_dir}"
    echo ${PWD}/${base_dir}.zip created
  else
    echo ${PWD}/${base_dir} created
  fi
fi
