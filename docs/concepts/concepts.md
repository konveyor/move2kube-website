---
layout: default
title: Concepts
permalink: /concepts
has_children: true
nav_order: 4
---

# Concepts

There are quite a few concepts that are useful to know when trying to customize the output of Move2Kube.
In this section we go over some of the more important ones. If you have not followed the [tutorials](/tutorials/customizing-the-output), we recommend checking those out first, then coming back here to see each concept in more detail.

## Transformer

Move2Kube uses [transformers](/concepts/transformer) which come together to effect transformation of input into output of desired form. Each transformer consumes [Artifacts](/concepts/artifact) and outputs [Artifacts](/concepts/artifact) and [PathMappings](/concepts/path-mapping). The Artifacts allow multiple transformers to be chained together to achieve a end to end transformation. The PathMappings are used for persisting the changes in the filesystem.

Some transformers have detect capability to go through the various directories in the source to identify directories it understand and create new Artifacts to kick start the process.

## Planning phase

This phase is started by running the `move2kube plan -s path/to/source/directory` command.

During this phase Move2Kube runs all the transformers that support the detect capability on the source directory to come up with a plan. The plan is written to a file called `m2k.plan` in YAML format.
Later during the transformation phase Move2Kube will use this plan to transform the source files into the desired output.
The plan file is human readable and can be edited manually to change what transformations are done during the transformation phase.

The plan file contains the list of detected services that Move2Kube found inside the source directory, including the path to the sub-directories/files where it detected information about those services.
It also contains a list of all the built-in and external transformers that were detected. These will be run during the transformation phase.
If you write a custom transformer and provide it during the plan phase then you can affect the contents of the plan file.

## Transformation phase

This phase is started by running the `move2kube transform` command.

Move2Kube evaluates which transformers to run in an iterative manner. Each iteration Move2Kube will evaluate the list of artifacts produced during the previous iteration and run all transformers that consume those artifact types. This continues until it hits an iteration where there are no more artifacts or no more transformers that consume those artifact types. At this point the transformation phase is finished.

The evaluated result of all [PathMappings](/concepts/path-mapping) is the output.
