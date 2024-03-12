---
layout: default
title: "Enabling/disabling questions categories in Move2Kube CLI"
permalink: /tutorials/qa-categorization
parent: Tutorials
nav_order: 5
---

# Enabling or disabling entire categories of questions

## Description

This document will teach you how to disable the questions you commonly skip answering or leave default, by using the comprehensive questions category system in the Move2Kube CLI.

### TLDR

To *only* enable specific categories of questions:
```bash
$ move2kube transform -s <DIR> --qa-enable <CATEGORY 1> --qa-enable <CATEGORY 2>...
```

To disable specific categories:
```bash
$ move2kube transform -s <DIR> --qa-disable <CATEGORY 1> --qa-disable <CATEGORY 2>...
```

## Prerequisites

1. Install the [Move2Kube CLI tool](https://move2kube.konveyor.io/installation/cli)

1. Use our sample [docker-compose.yaml](https://raw.githubusercontent.com/konveyor/move2kube-demos/main/samples/docker-compose/single-service/docker-compose.yaml) file or your own

   ```console
   $ wget -P samples/docker-compose/ https://raw.githubusercontent.com/konveyor/move2kube-demos/main/samples/docker-compose/single-service/docker-compose.yaml
   ```

## Using the CLI with the default configuration

1. cd into the samples directory you downloaded and run the transform command like so:

    ```console
    $ move2kube transform -s docker-compose
    ```

1. Notice every question has a category, which is displayed at the right of the terminal window next to the question ID.

<img src="{{ site.baseurl }}/assets/images/m2k-qa-category.png"/>

Questions prompted by the Move2Kube CLI may belong to multiple **categories**. The categories of a question are specified by the QA Mapping [manifest file](https://raw.githubusercontent.com/konveyor/move2kube/efd1bdcccbd921457b09e21f1bd9a1b39bd7b06d/assets/built-in/qa/qamappings.yaml). (more on this later)
The Move2Kube CLI lets you disable certain categories of questions, or *only* enable certain categories of questions.

## Disabling categories

1. The `--qa-disable` flag lets users skip categories of questions entirely. Move2Kube will use the default answer to the question in its processing. You can skip questions related to image registries like so:

    ```console
    $ move2kube transform -s docker-compose --qa-disable imageregistry
    ```

**Note**: You will have to delete the `myproject` output directory created by the earlier usage of Move2Kube, or pass the `--overwrite` flag to the CLI.

1. To disable multiple categories (for example: image registry and networking), you can pass the --qa-disable flag multiple times:

    ```console
    $ move2kube transform -s docker-compose --qa-disable imageregistry --qa-disable network
    ```

## Enabling categories

1. The `--qa-enable` flag is analogous to disabling *every category* except those passed to the flag. If you enable the `sourceanalyzer` category, all questions not belonging to it will be skipped:

    ```console
    $ move2kube transform -s docker-compose --qa-enable sourceanalyzer
    ```

1. You can enable multiple categories by repeating the --qa-enable flag, similar to --qa-disable.

**Note**: --qa-disable and --qa-enable are mutually exclusive: they *cannot* be used in conjunction.

## Category Manifest file

1. Questions in Move2Kube are categorized according to the [manifest file](https://raw.githubusercontent.com/konveyor/move2kube/efd1bdcccbd921457b09e21f1bd9a1b39bd7b06d/assets/built-in/qa/qamappings.yaml). It maps category names to a list of question IDs belonging to the category. It also provides a handy way of viewing all questions belonging to a certain category.

1. Questions with **dynamic IDs** (for example, question IDs containing the name of a service) are represented as globs in the manifest. `move2kube.services.*.enable` refers to any questions of the form `move2kube.services.[CATEGORY NAME].enable`.

## Usage with External Transformers

By default, questions prompted by Starlark transformer are categorized as `external`. To add your own category to them, pass it to the `categories` attribute of the `m2k.query` method like so:

```
                    useStatefulSet = m2k.query({"id": "move2kube."+name +".statefulSet",
                                                "type": "Select",
                                                "options": ["Yes", "No"],
                                                "description": "Use StatefulSet instead of Deployment for the "+ name + " service : ",
                                                "categories": ["statefulset"]})

```