---
layout: default
title: "Running non-interactively"
permalink: /tutorials/running-non-interactively
parent: Tutorials
nav_order: 3
---

# Running non-interactively

## Prerequisites

Complete the [Migration Workflow](/tutorials/migration-workflow) tutorial first and familiarize yourself with the [transformation](/tutorials/migration-workflow/transform) process.

We will be using the same [e2e-demo](https://github.com/konveyor/move2kube-demos/tree/dda15a4c8bd7a750d0e57bd31dd926fd135c4a3c/samples/enterprise-app) app from that tutorial. You can download the zip file containing the source code from [here](https://github.com/konveyor/move2kube-demos/blob/dda15a4c8bd7a750d0e57bd31dd926fd135c4a3c/samples/enterprise-app/src.zip)

## Overview

### TLDR

```console
$ move2kube transform --config path/to/m2kconfig.yaml
```

Move2Kube asks a lot of questions during the transformation phase. After looking at the output of the transformation we may want to rerun the transformation,
giving different answers to some of the questions that were asked. In order to avoid answering all of the same questions over and over, Move2Kube provides us with a simple configuration file.

If we look at the directory where we ran the `move2kube transform` command, we see a file called `m2kconfig.yaml`. This file contains the answers we provided to all of the questions that were asked. There is also a `m2kqacache.yaml` file which contains both the questions and the answers in more detail.

We can use this file when we run the transform using the `--config` flag

## Steps

1. If you already have a `m2kconfig.yaml` from a previous run then skip this step.  
    Run the plan and transform on the `e2e-demo` source, answer all the questions as appropriate.
    ```console
    $ ls
    src	src.zip
    $ move2kube plan -s src
    INFO[0000] Configuration loading done                   
    INFO[0000] Planning Transformation - Base Directory     
    ...
    INFO[0000] No of services identified : 6                
    INFO[0000] Plan can be found at [/Users/user/Desktop/tutorial/m2k.plan].
    $ move2kube transform
    INFO[0000] Detected a plan file at path /Users/user/Desktop/tutorial/m2k.plan. Will transform using this plan. 
    ...
    INFO[0095] Plan Transformation done
    INFO[0095] Transformed target artifacts can be found at [/Users/user/Desktop/tutorial/myproject].
    ```

1. Looking at the output we see the `m2kconfig.yaml` file.

    ```console
    $ ls
    m2k.plan	m2kconfig.yaml	m2kqacache.yaml	myproject	src		src.zip
    $ cat m2kconfig.yaml 
    ```
    Your `m2kconfig.yaml` might look different depending on what questions where asked and what answers you gave.
    ```yaml
    move2kube:
      containerruntime: docker
      minreplicas: "2"
      services:
        config-utils:
          enable: false
        customers-tomcat:
          "8080":
            urlpath: /customers-tomcat
          enable: true
          wartransformer: Tomcat
        frontend:
          "8080":
            urlpath: /frontend
          enable: true
          port: "8080"
        gateway:
          "8080":
            urlpath: /gateway
          activemavenprofiles:
            - local
          activespringbootprofiles:
            - local
          enable: true
          port: "8080"
        inventory:
          "8080":
            urlpath: /inventory
          activemavenprofiles:
            - local
          enable: true
          port: "8080"
        orders:
          "8080":
            urlpath: /orders
          activemavenprofiles:
            - local
          activespringbootprofiles:
            - local
          enable: true
          port: "8080"
      target:
        clustertype: Kubernetes
        imageregistry:
          logintype: No authentication
          namespace: move2kube
          url: quay.io
        ingress:
          host: localhost
          tls: ""
      transformers:
        types:
          - Buildconfig
          - ClusterSelector
          - ComposeGenerator
          - Liberty
          - Parameterizer
          - Rust-Dockerfile
          - Tekton
          - Tomcat
          - WinSLWebApp-Dockerfile
          - Python-Dockerfile
          - ReadMeGenerator
          - WarRouter
          - CloudFoundry
          - Knative
          - WinWebApp-Dockerfile
          - DockerfileParser
          - Maven
          - ContainerImagesPushScriptGenerator
          - Golang-Dockerfile
          - EarRouter
          - Gradle
          - KubernetesVersionChanger
          - Nodejs-Dockerfile
          - WarAnalyser
          - ZuulAnalyser
          - DockerfileDetector
          - DockerfileImageBuildScript
          - EarAnalyser
          - Jar
          - Kubernetes
          - Ruby-Dockerfile
          - ComposeAnalyser
          - DotNetCore-Dockerfile
          - Jboss
          - PHP-Dockerfile
          - WinConsoleApp-Dockerfile
    ```

1. The config file only contains the answers we provided to the questions. We can better understand the config file by looking at its companion file `m2kqacache.yaml`

    ```console
    $ cat m2kqacache.yaml 
    ```
    ```yaml
    apiVersion: move2kube.konveyor.io/v1alpha1
    kind: QACache
    spec:
      solutions:
        - id: move2kube.transformers.types
          type: MultiSelect
          description: 'Select all transformer types that you are interested in:'
          hints:
            - Services that don't support any of the transformer types you are interested in will be ignored.
          options:
            - Jar
            - Gradle
            - ReadMeGenerator
            - DockerfileParser
            - DockerfileImageBuildScript
            - EarAnalyser
            - WinWebApp-Dockerfile
            - Maven
            - Nodejs-Dockerfile
            - ZuulAnalyser
            - Buildconfig
            - Liberty
            - Parameterizer
            - Kubernetes
            - WarAnalyser
            - ComposeGenerator
            - Ruby-Dockerfile
            - WarRouter
            - ContainerImagesPushScriptGenerator
            - Rust-Dockerfile
            - KubernetesVersionChanger
            - Tomcat
            - Knative
            - Jboss
            - WinConsoleApp-Dockerfile
            - EarRouter
            - ClusterSelector
            - CloudFoundry
            - PHP-Dockerfile
            - Tekton
            - DotNetCore-Dockerfile
            - DockerfileDetector
            - Python-Dockerfile
            - Golang-Dockerfile
            - ComposeAnalyser
            - WinSLWebApp-Dockerfile
          default:
            - Jar
            - Gradle
            - ReadMeGenerator
            - DockerfileParser
            - DockerfileImageBuildScript
            - EarAnalyser
            - WinWebApp-Dockerfile
            - Maven
            - Nodejs-Dockerfile
            - ZuulAnalyser
            - Buildconfig
            - Liberty
            - Parameterizer
            - Kubernetes
            - WarAnalyser
            - ComposeGenerator
            - Ruby-Dockerfile
            - WarRouter
            - ContainerImagesPushScriptGenerator
            - Rust-Dockerfile
            - KubernetesVersionChanger
            - Tomcat
            - Knative
            - Jboss
            - WinConsoleApp-Dockerfile
            - EarRouter
            - ClusterSelector
            - CloudFoundry
            - PHP-Dockerfile
            - Tekton
            - DotNetCore-Dockerfile
            - DockerfileDetector
            - Python-Dockerfile
            - Golang-Dockerfile
            - ComposeAnalyser
            - WinSLWebApp-Dockerfile
          answer:
            - Buildconfig
            - ClusterSelector
            - ComposeGenerator
            - Liberty
            - Parameterizer
            - Rust-Dockerfile
            - Tekton
            - Tomcat
            - WinSLWebApp-Dockerfile
            - Python-Dockerfile
            - ReadMeGenerator
            - WarRouter
            - CloudFoundry
            - Knative
            - WinWebApp-Dockerfile
            - DockerfileParser
            - Maven
            - ContainerImagesPushScriptGenerator
            - Golang-Dockerfile
            - EarRouter
            - Gradle
            - KubernetesVersionChanger
            - Nodejs-Dockerfile
            - WarAnalyser
            - ZuulAnalyser
            - DockerfileDetector
            - DockerfileImageBuildScript
            - EarAnalyser
            - Jar
            - Kubernetes
            - Ruby-Dockerfile
            - ComposeAnalyser
            - DotNetCore-Dockerfile
            - Jboss
            - PHP-Dockerfile
            - WinConsoleApp-Dockerfile
        - id: move2kube.services.[].enable
          type: MultiSelect
          description: 'Select all services that are needed:'
          hints:
            - The services unselected here will be ignored.
          options:
            - frontend
            - gateway
            - inventory
            - orders
            - config-utils
            - customers-tomcat
          default:
            - frontend
            - gateway
            - inventory
            - orders
            - config-utils
            - customers-tomcat
          answer:
            - frontend
            - gateway
            - inventory
            - orders
            - customers-tomcat
        - id: move2kube.services.inventory.activemavenprofiles
          type: MultiSelect
          description: Choose the Maven profile to be used for the service inventory
          hints:
            - Selected Maven profiles will be used for setting configuration for the service inventory
          options:
            - native
            - local
            - openshift
          default:
            - openshift
          answer:
            - local
        - id: move2kube.services.inventory.port
          type: Select
          description: 'Select port to be exposed for the service inventory :'
          hints:
            - Select Other if you want to expose the service inventory to some other port
          options:
            - "8080"
            - Other (specify custom option)
          default: "8080"
          answer: "8080"
        - id: move2kube.services.customers-tomcat.wartransformer
          type: Select
          description: Select the transformer to use for service customers-tomcat
          options:
            - Tomcat
            - Liberty
            - Jboss
          default: Tomcat
          answer: Tomcat
        - id: move2kube.services."frontend"."8080".urlpath
          type: Input
          description: What URL/path should we expose the service frontend's 8080 port on?
          hints:
            - Enter :- not expose the service
            - Leave out leading / to use first part as subdomain
            - Add :N as suffix for NodePort service type
            - Add :L for Load Balancer service type
          default: /frontend
          answer: /frontend
        - id: move2kube.services."orders"."8080".urlpath
          type: Input
          description: What URL/path should we expose the service orders's 8080 port on?
          hints:
            - Enter :- not expose the service
            - Leave out leading / to use first part as subdomain
            - Add :N as suffix for NodePort service type
            - Add :L for Load Balancer service type
          default: /orders
          answer: /orders
        - id: move2kube.services."gateway"."8080".urlpath
          type: Input
          description: What URL/path should we expose the service gateway's 8080 port on?
          hints:
            - Enter :- not expose the service
            - Leave out leading / to use first part as subdomain
            - Add :N as suffix for NodePort service type
            - Add :L for Load Balancer service type
          default: /gateway
          answer: /gateway
        - id: move2kube.minreplicas
          type: Input
          description: Provide the minimum number of replicas each service should have
          hints:
            - If the value is 0 pods won't be started by default
          default: "2"
          answer: "2"
        - id: move2kube.target.imageregistry.url
          type: Select
          description: 'Enter the URL of the image registry : '
          hints:
            - You can always change it later by changing the yamls.
          options:
            - Other (specify custom option)
            - quay.io
            - index.docker.io
          default: quay.io
          answer: quay.io
        - id: move2kube.target.imageregistry.namespace
          type: Input
          description: 'Enter the namespace where the new images should be pushed : '
          hints:
            - 'Ex : myproject'
          default: myproject
          answer: move2kube
        - id: move2kube.target.imageregistry.logintype
          type: Select
          description: '[quay.io] What type of container registry login do you want to use?'
          hints:
            - Docker login from config mode, will use the default config from your local machine.
          options:
            - Use existing pull secret
            - No authentication
            - UserName/Password
          default: No authentication
          answer: No authentication
        - id: move2kube.target.clustertype
          type: Select
          description: 'Choose the cluster type:'
          hints:
            - Choose the cluster type you would like to target
          options:
            - GCP-GKE
            - IBM-IKS
            - IBM-Openshift
            - Kubernetes
            - Openshift
            - AWS-EKS
            - Azure-AKS
          default: Kubernetes
          answer: Kubernetes
        - id: move2kube.target.ingress.host
          type: Input
          description: Provide the ingress host domain
          hints:
            - Ingress host domain is part of service URL
          default: myproject.com
          answer: localhost
        - id: move2kube.target.ingress.tls
          type: Input
          description: Provide the TLS secret for ingress
          hints:
            - Leave empty to use http
          default: ""
          answer: ""
        - id: move2kube.services.frontend.port
          type: Select
          description: 'Select port to be exposed for the service frontend :'
          hints:
            - Select Other if you want to expose the service frontend to some other port
          options:
            - "8080"
            - Other (specify custom option)
          default: "8080"
          answer: "8080"
        - id: move2kube.services.gateway.activemavenprofiles
          type: MultiSelect
          description: Choose the Maven profile to be used for the service gateway
          hints:
            - Selected Maven profiles will be used for setting configuration for the service gateway
          options:
            - local
            - openshift
            - openshift-manual
            - openshift-it
          default:
            - openshift
          answer:
            - local
        - id: move2kube.services.gateway.activespringbootprofiles
          type: MultiSelect
          description: Choose Springboot profiles to be used for the service gateway
          hints:
            - Selected Springboot profiles will be used for setting configuration for the service gateway
          options:
            - local
            - openshift
          default:
            - local
            - openshift
          answer:
            - local
        - id: move2kube.services.gateway.port
          type: Select
          description: 'Select port to be exposed for the service gateway :'
          hints:
            - Select Other if you want to expose the service gateway to some other port
          options:
            - "8080"
            - Other (specify custom option)
          default: "8080"
          answer: "8080"
        - id: move2kube.services.orders.activemavenprofiles
          type: MultiSelect
          description: Choose the Maven profile to be used for the service orders
          hints:
            - Selected Maven profiles will be used for setting configuration for the service orders
          options:
            - local
            - openshift
            - openshift-manual
            - openshift-it
          default:
            - openshift
          answer:
            - local
        - id: move2kube.services.orders.activespringbootprofiles
          type: MultiSelect
          description: Choose Springboot profiles to be used for the service orders
          hints:
            - Selected Springboot profiles will be used for setting configuration for the service orders
          options:
            - local
            - openshift
          default:
            - local
            - openshift
          answer:
            - local
        - id: move2kube.services.orders.port
          type: Select
          description: 'Select port to be exposed for the service orders :'
          hints:
            - Select Other if you want to expose the service orders to some other port
          options:
            - "8080"
            - Other (specify custom option)
          default: "8080"
          answer: "8080"
        - id: move2kube.containerruntime
          type: Select
          description: 'Select the container runtime to use :'
          hints:
            - The container runtime selected will be used in the scripts
          options:
            - docker
            - podman
          default: docker
          answer: docker
        - id: move2kube.services."customers-tomcat"."8080".urlpath
          type: Input
          description: What URL/path should we expose the service customers-tomcat's 8080 port on?
          hints:
            - Enter :- not expose the service
            - Leave out leading / to use first part as subdomain
            - Add :N as suffix for NodePort service type
            - Add :L for Load Balancer service type
          default: /customers-tomcat
          answer: /customers-tomcat
        - id: move2kube.services."inventory"."8080".urlpath
          type: Input
          description: What URL/path should we expose the service inventory's 8080 port on?
          hints:
            - Enter :- not expose the service
            - Leave out leading / to use first part as subdomain
            - Add :N as suffix for NodePort service type
            - Add :L for Load Balancer service type
          default: /inventory
          answer: /inventory
    ```

1. The cache file contains both the questions and the answers. It also contains additional information about each question, such as the default answer,
the type of the question, the id of the questions, any hints that were provided, etc.

1. The config file stores the answer to a question under the key specified by the question's id.  
For example, the question `What URL/path should we expose the service inventory's 8080 port on?` has the id `move2kube.services."inventory"."8080".urlpath`.
So we find the answer `/inventory` stored as
    ```yaml
    move2kube:
      services:
        inventory:
          "8080":
            urlpath: /inventory
    ```
    in the config file. Every time Move2Kube goes to ask a question, it first checks the config file to see if it has already been answered using the question's id.
    If the id is not present in the config file, Move2Kube will usually ask the user for the answer. This means we can provide the answer to any question by storing it in the config file.



1. Let's run the transform again but this time with the config file we generated.

    ```console
    $ mv myproject old # rename the output folder from the previous run to avoid conflicts
    $ ls
    m2k.plan	m2kconfig.yaml	m2kqacache.yaml	old		src		src.zip
    $ move2kube transform --config m2kconfig.yaml
    INFO[0000] Detected a plan file at path /Users/user/Desktop/tutorial/m2k.plan. Will transform using this plan. 
    INFO[0000] Starting Plan Transformation                 
    ...
    INFO[0007] Plan Transformation done                     
    INFO[0007] Transformed target artifacts can be found at [/Users/user/Desktop/tutorial/myproject].
    $ ls
    m2k.plan	m2kconfig.yaml	m2kqacache.yaml	myproject	old		src		src.zip
    ```
    This time Move2Kube didn't ask us any questions because we provided all of the answers using the config file.
    We can edit the config file directly if we need to change the answer to a question. We can also remove some of the answers
    from the config file if we want Move2Kube to ask us those questions again. This gives us a nice way to iterate quickly, as well
    as a way to run Move2Kube non-interatively.
