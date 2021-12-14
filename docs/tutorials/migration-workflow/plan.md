---
layout: default
title: "Plan"
permalink: /tutorials/migration-workflow/plan
parent: "Migration workflow"
grand_parent: Tutorials
nav_order: 2
---

# Plan

Now that we have collected cluster metadata using `collect` we can start planning.

During the plan phase Move2Kube will analyze the files in the source directory, detect what services exist and come up with a plan to containerize them using Dockerfiles and transform them into Kubernetes Deployments, Services, Ingress, etc.

In order to do the planning Move2Kube has a large number of built-in transformers for various different languages and platforms. Each transformer walks through the source directory from top to bottom and tries to find files that it recognizes.
For example, a Golang transformer might try to find `go.mod` file to detect a Golang project. Once it detects a directory containing a service, it will try to extract as much information from it as possible. Some of the information it tries to find is the service name, ports, environment variables, etc.

This information is stored in YAML format in a plan file called `m2k.plan`. This file is used later during the transformation phase. We can also edit this file to enable/disable transformers, add/remove detected services, etc.

## Planning using the collected information

1. First copy all the cluster metdata we collected into a directory.

```console
$ mkdir customizations
$ cp -r *.yaml customizations/
```

1. Run `move2kube plan -s path/to/e2e-demo -c customizations` to generate a plan on how to migrate our app to Kubernetes.

Now that we have generated a plan file we can move on to the transformation phase which generates the output we need to deploy our app to Kubernetes.

Next step [Transform](/tutorials/migration-workflow/transform)
