---
layout: default
title: Executable
permalink: /transformers/external/executable
parent: External
grand_parent: Transformers
has_children: false
nav_order: 2
---

# Executable

An `Executable` class based transformer can be configured to run commands locally or as containers. These transformers essentially implement the `DirectoryDetect` and `Transform` functions of the transformer as executable commands. This allows for the use of any language to write the function, and hence these make them very powerful.