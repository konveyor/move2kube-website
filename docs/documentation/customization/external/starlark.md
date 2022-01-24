---
layout: default
title: Starlark
permalink: /documentation/customization/external/starlark
parent: External
has_children: false
nav_order: 1
---

# Starlark

A `Starlark` class based transformer allows for writing a full fledged transformer in [starlark](https://docs.bazel.build/versions/2.1.0/skylark/language.html) by implementing the `directory_detect` and `transform` functions. 

Samples of use of this transform class can be found in [here](https://github.com/konveyor/move2kube-transformers/tree/main/add-custom-kubernetes-annotation) and [here](https://github.com/konveyor/move2kube-transformers/tree/main/add-custom-files-directories-in-custom-locations)