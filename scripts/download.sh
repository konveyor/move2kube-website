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


HAS_UNZIP="$(command -v unzzip >/dev/null && echo true || echo false)"
HAS_ZIP="$(command -v zip >/dev/null && echo true || echo false)"

if [ "$HAS_UNZIP" != 'true' ]; then
  echo 'failed, please install unzip and run this download script again'
  exit 1
fi

repo='move2kube-transformers'
unset dir
unset outputdir
zip_flag="false"
quiet_flag="false"

print_usage() {
  printf "Usage: ./download.sh -d <dir> -r <repo> -o <outputdir>"
  printf "use -z if output is required as zip"
  printf ""
}

while getopts 'r:d:o:zq' flag; do
  case "${flag}" in
    r) repo="${OPTARG}" ;;
    d) dir="${OPTARG}" ;;
    o) outputdir="${OPTARG}" ;;
    z) zip_flag="true" ;;
    q) quiet_flag="true" ;;
    *) print_usage
       exit 1 ;;
  esac
done

if [ -n "$outputdir" ]; then
  mkdir -p "$outputdir"
  cd "$outputdir" || exit 1
fi

if [ $quiet_flag == "true" ]; then
  curl -sS -Lo "${repo}.zip" "https://github.com/konveyor/${repo}/archive/refs/heads/main.zip"
else 
  curl -Lo "${repo}.zip" "https://github.com/konveyor/${repo}/archive/refs/heads/main.zip"
fi

base_dir=${repo}

if [ -z "$dir" ]; then
  unzip -q "${repo}.zip" "${repo}-main/*"
  mv "${repo}-main/" "${repo}"
else 
  base_dir=${dir##*/}
  unzip -q "${repo}.zip" "${repo}-main/$dir/*"
  rm -rf "${base_dir}"
  mv "${repo}-main/$dir" "${base_dir}"
fi

rm -rf "${repo}.zip"
rm -rf "${repo}-main"

if [ "$zip_flag" = 'true' ]; then
  if [ "$HAS_ZIP" != 'true' ]; then
    echo 'failed, please install zip and run this download script again'
    exit 1
  fi
  zip -q -r "${base_dir}.zip" "${base_dir}/"
  rm -rf "${base_dir}"
  echo "${PWD}/${base_dir}.zip created"
else
  echo "${PWD}/${base_dir} created"
fi
