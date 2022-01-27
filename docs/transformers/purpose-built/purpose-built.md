---
layout: default
title: Purpose Built
permalink: /transformers/purpose-built
parent: Transformers
has_children: true
nav_order: 1
---

# Purpose Built

These transformer classes do a specific job, and the customization allows you to change the parameters/configuration required for performing the specific job.

In most cases, these classes have one internal implementation, and you will find a transformer configuration in [here](https://github.com/konveyor/move2kube/tree/main/assets/built-in/transformers). 

The general steps to use these transformer classes are:
1. Find the internal implementation in [here](https://github.com/konveyor/move2kube/tree/main/assets/built-in/transformers). 
1. Copy the directory
1. Change the configuration like transformer name, templates, etc..
1. Set the override to override the internal implementation.

The [custom transformer tutorial](https://move2kube.konveyor.io/tutorials/customizing-the-output/custom-dockerfile-change-built-in-behavior) that uses [nodejs/kubernetes transformers](https://github.com/konveyor/move2kube-transformers/tree/main/custom-dockerfile-change-built-in-behavior) and the [parameterization](https://move2kube.konveyor.io/tutorials/customizing-the-output/custom-parameterization-of-helm-charts-kustomize-octemplates) tutorial that uses [parameterization transformer](https://github.com/konveyor/move2kube-transformers/tree/main/custom-helm-kustomize-octemplates-parameterization) are examples.

To understand the configuration provided by each of these transformers, the yaml in the built-in transformer should give a good hint. The other location to look for is the struct in the transformer implementation. In most classes which have a config, there will be a struct with name ending in `YamlConfig`. For example, In Kubernetes transformer class, you can find [KubernetesYamlConfig](https://github.com/konveyor/move2kube/blob/171f6d26c195ce1e1f8b0ec6e7b68d17401776f3/transformer/kubernetes/kubernetestransformer.go#L48). This is the config that is specified in the spec.config field.