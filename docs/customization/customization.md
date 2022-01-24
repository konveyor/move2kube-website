---
layout: default
title: Customization
permalink: /customization
has_children: true
has_toc: false
nav_order: 3
---

# Customization

As was discussed in the [concepts](/concepts), Move2Kube uses an suite of transformers to achieve the transformation. To customize the output artifacts generated for a specific input, these transformers can be configured or new custom transformers can be added to achieve the required result.

Customization is achieved by changing a transformer behavior or creating a new transformer. A transformer's behavior and configuration is determined by the Transformer Class it uses. Though all the transformer classes are equal internally in Move2Kube, from usage perspective, we have classified into 3 categories. 

1. [Purpose Built](/customization/purpose-built) - Has a specific job, and the customization allows you to change the parameters/configuration required for performing the specific job. Ex: `Kubernetes`, `Parameterizer`, `GolangDockerfileGenerator`, etc..
2. [External](/customization/external) - Allows you to write custom transformers performing any behavior. It exposes the internal functions of the transformer class through different interfaces, to be implemented by the transformer externally. Ex: `Starlark`, `Executable`
3. [Special](/customization/special) - These classes allow special behaviors. Ex: `Router`
