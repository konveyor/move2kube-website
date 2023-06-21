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

Here are some starlark transformer examples: [add-custom-files-directories-in-custom-locations](https://github.com/konveyor/move2kube-transformers/tree/main/add-custom-files-directories-in-custom-locations), [add-custom-kubernetes-annotation](https://github.com/konveyor/move2kube-transformers/tree/main/add-custom-kubernetes-annotation), [cloud-foundry-to-ce-iks-roks](https://github.com/konveyor/move2kube-transformers/tree/main/cloud-foundry-to-ce-iks-roks), [custom-default-transformer](https://github.com/konveyor/move2kube-transformers/tree/main/custom-default-transformer), [custom-m2kcollect-yaml-file-to-csv-file](https://github.com/konveyor/move2kube-transformers/tree/main/custom-m2kcollect-yaml-file-to-csv-file).

## Functions to implement

* `directory_detect()` - It should be implemented to check if there are relevant files in the directory to invoke the transformer. See example [here](https://github.com/konveyor/move2kube-transformers/blob/0d6e555c85221493928cd1e899ffcb29ab69108a/add-custom-files-directories-in-custom-locations/customhelmchartgen.star#L17).
* `transform()` - It should be implemented to make changes on the input artifacts and output relevant artifacts for the rest of the transformation journey. See example [here](https://github.com/konveyor/move2kube-transformers/blob/0d6e555c85221493928cd1e899ffcb29ab69108a/add-custom-kubernetes-annotation/ingress-annotator.star#L18).

More details can be found [here](https://move2kube.konveyor.io/concepts/transformer#methods). 


## In-built functions

Move2Kube also makes available many functions, which can be used by transformer developers in the custom transformers.

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

Example :
```python
regUrl = m2k.query({"id": "move2kube.target.imageregistry.url",
                    "type": "Input",
                    "description": "Enter the URL of the image registry where the new images should be pushed : ",
                    "hints": ["example images registries are quay.io and hub.docker.io"],
                    "default": "quay.io"
                    })
```

Second argument which is optional is the validator function name as string. If the input from the user does not comply with the provided validator function then question is asked until the expected input is received.

Example :
```python
def imageRegistryValidator(input):
    if input == "":
        return "Image registry URL cannot be empty."
...

regUrl = m2k.query({"id": "move2kube.target.imageregistry.url",
                    "type": "Input",
                    "description": "Enter the URL of the image registry where the new images should be pushed : ",
                    "hints": ["example images registries are quay.io and hub.docker.io"]
                    }, "imageRegistryValidator")
```


### File system
Move2Kube provides a set a functions in starlark for filesystem based operations. The functions are packaged within `fs` package and they should be invoked with the package name.

| Function name in starlark | Purpose | Arguments | Returns |
| ----------- | ----------- | ----------- | ----------- | 
| `exists`| Check if the provided file exists or not | filepath as string | boolean |
| `read`| Reads the given file | filepath as string | string |
| `read_dir`| Obtain list of files names in a directory | directory path as string | []string | 
| `is_dir`| Check if the given path is a directory or not | path as string | boolean | 
| `get_yamls_with_type_meta`| Return files by yaml kind | path to directory containing yamls as string <br/> kind of yamls required as string | []string| 
| `find_xml_path`| Return XML value based on the [XPath expression](https://www.w3schools.com/xml/xml_xpath.asp) in the given XML file | path to XML file as string <br/> XPath expression | []interface{}| 
| `get_files_with_pattern` | Get files in the given directory with a particular extension | path to directory as string <br/> extension as string | []string |
| `path_join` | Join two paths | first as path as string <br/> second path as string| string |
| `write` | Write data to a file and returns number of bytes written | path to a file as string <br/> data to be written as a string <br/> file permissions (optional) as an integer | int
| `path_base` | Return last element of the given path | path as string | string
| `path_rel` | Return relative path | base path as string <br/> target path as string | string

Example :

```python
isExists = fs.exists("path/to/the/file")
fileContent = fs.read("path/to/the/file")
ListOfFiles = fs.read_dir("path/to/the/directory")
isDirectory = fs.is_dir("path/to/the/directory")
yamlFiles = fs.get_yamls_with_type_meta("path/to/the/directory", "kind of resource")
XMLValue = fs.find_xml_path("path/to/XML/file", "XPath/expression")
FilesWithExt = fs.get_files_with_pattern("path/to/the/directory", ["txt", "yaml"])
path = fs.path_join("base/path", "/relative/path")
numberOfBytesWritten = fs.write("path/to/the/file", "some data", 777)
basePath = fs.path_base("some/path")
relativePath = fs.path_rel("base/path", "target/path")
```

### Golang Template

See https://pkg.go.dev/text/template

| Function name in starlark | Purpose | Arguments | Returns |
| ----------- | ----------- | ----------- | ----------- | 
| `eval_template`| Evaluate and fill the Golang template using some data | Template (string) <br/> Data to fill the template (dict) | string |

Example:

{% raw %}
```python
my_template = """
name: "{{ .Name }}"
{{- if .EnvVolumes }}
volumes:
  {{- range $k, $v := .EnvVolumes}}
  {{$k}}:
    {{- range $vk, $vv := $v}}
    {{$vk}}: "{{$vv}}"
    {{- end}}
  {{- end}}
{{- end}}
"""
data = {
    "Name": "John Doe",
    "EnvVolumes": {
        "foo": {
            "a": "b",
            "c": "d",
        },
        "bar": {
            "e": "f",
            "g": "h",
        },
    },
}
filled_template = template.eval_template(my_template, data)
print(filled_template)
```
{% endraw %}

### Cryptography
Move2Kube provides a set a functions in starlark for Cryptography. The functions are packaged within `crypto` package and they should be invoked with the package name.

| Function name in starlark | Purpose | Arguments | Returns |
| ----------- | ----------- | ----------- | ----------- | 
| `enc_aes_cbc_pbkdf`| Encrypt the data using AES 256 CBC mode with Pbkdf key derivation and return the cipher text | key as string <br /> data as string | string |
| `enc_rsa_cert`| Encrypt the data using RSA PKCS1v15 algorithm with certificate as key and return cipher text | certificate as string <br /> data as string | string |

Example :

```python
cipher = crypto.enc_aes_cbc_pbkdf("some key", "some data to be encrypted")
cipher = crypto.enc_rsa_cert("some certificate", "some data to be encrypted")
```

### Archival
Move2Kube provides a set a functions in starlark for Archival. The functions are packaged within `archive` package and they should be invoked with the package name.

| Function name in starlark | Purpose | Arguments | Returns |
| ----------- | ----------- | ----------- | ----------- | 
| `arch_tar_gzip_str`| archive a set of files and compression using gzip and return the digest | path to the directory containing the files as string | string |
| `arch_tar_str`| archive a set of files and compression without compression and and return the digest | path to the directory containing files as string | string |


Example :

```python
digest = archive.arch_tar_gzip_str("path/to/some/directory")
digest = archive.arch_tar_str("path/to/some/directory")
```


## Variables
Move2Kube provides variables which expose values required by the transformer.

* `source_dir` - Exposes the source path in the environment.
* `context_dir` - Exposes the context path in the environment.
* `temp_dir` - Exposes the environment temporary path.
* `templates_reldir` - Exposes the relative path to the templates directory.
* `config` - Exposes the transformer meta data.
* `resources_dir` - Exposes the path to the resources directory.
* `output_dir` - Exposes the path to the output directory where the transformer output artifacts are produced.

