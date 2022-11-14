---
layout: default
title: Starlark
permalink: /transformers/external/starlark
parent: External
grand_parent: Transformers
has_children: false
nav_order: 1
---

# Starlark

A `Starlark` class based transformer allows for writing a full fledged transformer in [starlark](https://docs.bazel.build/versions/2.1.0/skylark/language.html) by implementing the `directory_detect` and `transform` functions. 

Samples of use of this transform class can be found in [here](https://github.com/konveyor/move2kube-transformers/tree/main/add-custom-kubernetes-annotation) and [here](https://github.com/konveyor/move2kube-transformers/tree/main/add-custom-files-directories-in-custom-locations)

## Functions

### Transform

* `directory_detect()` - It should be implemented to check if there are relevant files in the directory to invoke the transformer.
* `transform()` - It should be implemented to make changes on the input artifacts and output relevant artifacts for the rest of the transformation journey.

More details can be found [here](https://move2kube.konveyor.io/concepts/transformer#methods). 


### QA Engine

The functions related to QA Engine are packaged within `m2k` package and they should be invoked with the package name.

* `query()` - Used to prompt Users for input. The function takes two arguments. 

First is a dictionary with key as variables in the QAEngine's Problem interface and value as value of the variables.

| Variable (dict key) | Value (dict value) | Type |
| ----------- | ----------- | ----------- | 
| id | Unique ID for the prompt | string |
| type   | Type of the input. `Input` for single line input type, `Select` for single select input type, `MultiSelect` for multi-select input type, `MultiLineInput` for multiline input type, `Password` for password input type, and `Confirm` for yes/no input type.| string |
| description   | Question text| string |
| hints  | List of hints | []string|
| options   | List of options to choose from usually used for `Select` and `MultiSelect` input types.      | []string |
| default   | Default input value if the user provide no input | type same as input type |

Second argument which is optional is the validator function. If the input from the user does not comply with the provided validator function then question is asked until the expected input is received.

Example usage can be found [here](https://github.com/konveyor/move2kube-transformers/blob/2a36d11efb996f2f38cdb3e3ecccfe9378e3a444/cloud-foundry-to-ce-iks-roks/cedockerfile/cedockerfile.star#L52-L63).


### File system
Move2Kube provides a set a functions in starlark for filesystem based operations. The functions are packaged within `fs` package and they should be invoked with the package name.

| Function name in starlark | Purpose | Arguments | Returns |
| ----------- | ----------- | ----------- | ----------- | 
| `exists`| Check if the provided file exists or not | filepath as string| boolean |
| `read`| Reads the given file | filepath as string | string |
| `read_dir`| Obtain list of files names in a directory | directory path as string | []string | 
| `is_dir`| Check if the given path is a directory or not | path as string | boolean | 
| `get_yamls_with_type_meta`| Return files by yaml kind | path to directory containing yamls as string <br/> kind of yamls required as string | []string| 
| `find_xml_path`|  |  | | 
| `get_files_with_pattern` | Get files in the given directory with a particular extension | path to directory as string <br/> list of extensions as []string | []string |
| `path_join` | Join two paths | first as path as string <br/> second path as string| string |
| `write` | Write data to a file and returns number of bytes written | path to a file as string <br/> data to be written as a string <br/> file permissions (optional) as an integer | int
| `path_base` | Return last element of the given path | path as string | string
| `path_rel` | Return relative path | base path as string <br/> target path as string | string

### Cryptography
Move2Kube provides a set a functions in starlark for Cryptography. The functions are packaged within `crypto` package and they should be invoked with the package name.

| Function name in starlark | Purpose | Arguments | Returns |
| ----------- | ----------- | ----------- | ----------- | 
| `enc_aes_cbc_pbkdf`| Encrypt the data using AES 256 CBC mode with Pbkdf key derivation and return the cipher text | key as string <br /> data as string | string |
| `enc_rsa_cert`| Encrypt the data using RSA PKCS1v15 algorithm with certificate as key and return cipher text | certificate as string <br /> data as string | string |


### Archival
Move2Kube provides a set a functions in starlark for Archival. The functions are packaged within `archive` package and they should be invoked with the package name.

| Function name in starlark | Purpose | Arguments | Returns |
| ----------- | ----------- | ----------- | ----------- | 
| `arch_tar_gzip_str`| archive a set of files and compression using gzip and return the digest | path to the directory containing the files as string | string |
| `arch_tar_str`| archive a set of files and compression without compression and and return the digest | path to the directory containing files as string | string |


## Variables
Move2Kube provides variables which expose values required by the transformer.

* `source_dir` - Exposes the source path in the environment.
* `context_dir` - Exposes the context path in the environment.
* `temp_dir` - Exposes the environment temporary path.
* `templates_reldir` - Exposes the relative path to the templates directory.
* `config` - Exposes the transformer meta data.
* `resources_dir` - Exposes the path to the resources directory.
* `output_dir` - Exposes the path to the output directory where the transformer output artifacts are produced.

Here are some starlark transformer examples: [add-custom-files-directories-in-custom-locations](https://github.com/konveyor/move2kube-transformers/tree/main/add-custom-files-directories-in-custom-locations), [add-custom-kubernetes-annotation](https://github.com/konveyor/move2kube-transformers/tree/main/add-custom-kubernetes-annotation), [cloud-foundry-to-ce-iks-roks](https://github.com/konveyor/move2kube-transformers/tree/main/cloud-foundry-to-ce-iks-roks), [custom-default-transformer](https://github.com/konveyor/move2kube-transformers/tree/main/custom-default-transformer), [custom-m2kcollect-yaml-file-to-csv-file](https://github.com/konveyor/move2kube-transformers/tree/main/custom-m2kcollect-yaml-file-to-csv-file).
