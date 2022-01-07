---
layout: default
title: "Migrating from Docker Compose to Kubernetes"
permalink: /tutorials/migrating-from-docker-compose-to-kubernetes
parent: Tutorials
nav_order: 5
---

# Migrating from Docker Compose to Kubernetes

## Prerequisites

1. Complete the [Migration Workflow](/tutorials/migration-workflow) tutorial first and familiarize yourself with the [transformation](/tutorials/migration-workflow/transform) process.

1. A Kubernetes cluster. If you don't have one you can install [MiniKube](https://minikube.sigs.k8s.io/docs/start/).

## Overview

In this tutorial we will look at migrating an application written for Docker Compose to run on Kubernetes. We will be using the 2 [Docker Compose](https://github.com/konveyor/move2kube-demos/tree/076850e75846a11b58fcfa12aeb49468ca045423/samples/docker-compose) samples from the [move2kube-demos](https://github.com/konveyor/move2kube-demos) repo.

The [first sample](https://github.com/konveyor/move2kube-demos/tree/076850e75846a11b58fcfa12aeb49468ca045423/samples/docker-compose/single-service) is a web app with a single service using Nginx. It uses a prebuilt image.

The [second sample](https://github.com/konveyor/move2kube-demos/tree/076850e75846a11b58fcfa12aeb49468ca045423/samples/docker-compose/multiple-services) is more complicated. It's also a web app but it has 3 services. A frontend written in PHP for Apache, an API backend written for NodeJS and a service for caching the calculations performed by the backend. For the cache service we use a prebuilt Redis image.

Below we show the steps for migrating the second sample. The steps for the first sample are similar.

## Steps

1. Download the [zip file](https://github.com/konveyor/move2kube-demos/raw/16ef50910b590f4a3cba88555538f79a783656e2/samples/docker-compose.zip) containing the Docker Compose samples and extract the second sample from it.

    ```console
    $ curl -Lo docker-compose.zip https://github.com/konveyor/move2kube-demos/raw/16ef50910b590f4a3cba88555538f79a783656e2/samples/docker-compose.zip
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100   187  100   187    0     0    421      0 --:--:-- --:--:-- --:--:--   429
    100  6438  100  6438    0     0   6797      0 --:--:-- --:--:-- --:--:--     0
    $ unzip docker-compose.zip 
    Archive:  docker-compose.zip
       creating: docker-compose/
       creating: docker-compose/single-service/
      inflating: docker-compose/single-service/docker-compose.yaml  
      inflating: docker-compose/m2kqacache.yaml  
       creating: docker-compose/multiple-services/
     extracting: docker-compose/multiple-services/.m2kignore  
      inflating: docker-compose/multiple-services/docker-compose.yaml  
       creating: docker-compose/multiple-services/web/
      inflating: docker-compose/multiple-services/web/index.php  
     extracting: docker-compose/multiple-services/web/Dockerfile  
      inflating: docker-compose/multiple-services/web/fib.php  
       creating: docker-compose/multiple-services/api/
      inflating: docker-compose/multiple-services/api/Dockerfile  
      inflating: docker-compose/multiple-services/api/index.js  
      inflating: docker-compose/multiple-services/api/package-lock.json  
      inflating: docker-compose/multiple-services/api/package.json  
    $ ls
    docker-compose		docker-compose.zip
    $ ls docker-compose
    m2kqacache.yaml		multiple-services	single-service
    $ mv docker-compose/multiple-services .
    $ ls
    docker-compose		docker-compose.zip	multiple-services
    ```

1. Now we can run the planning phase.
    ```console
    $ move2kube plan -s multiple-services/
    INFO[0000] Configuration loading done                   
    INFO[0000] Planning Transformation - Base Directory     
    INFO[0000] [DockerfileDetector] Planning transformation 
    INFO[0000] Identified 1 named services and 1 to-be-named services 
    INFO[0000] [DockerfileDetector] Done                    
    INFO[0000] [CloudFoundry] Planning transformation       
    INFO[0000] [CloudFoundry] Done                          
    INFO[0000] [ComposeAnalyser] Planning transformation    
    INFO[0000] Identified 3 named services and 0 to-be-named services 
    INFO[0000] [ComposeAnalyser] Done                       
    INFO[0000] [Base Directory] Identified 4 named services and 1 to-be-named services 
    INFO[0000] Transformation planning - Base Directory done 
    INFO[0000] Planning Transformation - Directory Walk     
    INFO[0000] Identified 1 named services and 0 to-be-named services in api 
    INFO[0000] Identified 1 named services and 0 to-be-named services in web 
    INFO[0000] Transformation planning - Directory Walk done 
    INFO[0000] [Directory Walk] Identified 4 named services and 2 to-be-named services 
    INFO[0000] [Named Services] Identified 3 named services 
    INFO[0000] No of services identified : 3                
    INFO[0000] Plan can be found at [/Users/user/Desktop/tutorial/m2k.plan]
    ```

1. We can inspect the plan to see that all 3 services were detected.

    ```console
    $ cat m2k.plan 
    ```
    ```yaml
    apiVersion: move2kube.konveyor.io/v1alpha1
    kind: Plan
    metadata:
      name: myproject
    spec:
      sourceDir: multiple-services
      services:
        api:
          - transformerName: ComposeAnalyser
            paths:
              DockerCompose:
                - docker-compose.yaml
              Dockerfile:
                - api/Dockerfile
              ServiceDirPath:
                - api
            configs:
              ComposeService:
                serviceName: api
          - transformerName: Nodejs-Dockerfile
            paths:
              ServiceDirPath:
                - api
          - transformerName: DockerfileDetector
            paths:
              Dockerfile:
                - api/Dockerfile
              ServiceDirPath:
                - api
        redis:
          - transformerName: ComposeAnalyser
            paths:
              DockerCompose:
                - docker-compose.yaml
            configs:
              ComposeService:
                serviceName: redis
        web:
          - transformerName: ComposeAnalyser
            paths:
              DockerCompose:
                - docker-compose.yaml
              Dockerfile:
                - web/Dockerfile
              ServiceDirPath:
                - web
            configs:
              ComposeService:
                serviceName: web
          - transformerName: DockerfileDetector
            paths:
              Dockerfile:
                - web/Dockerfile
              ServiceDirPath:
                - web
          - transformerName: PHP-Dockerfile
            paths:
              ServiceDirPath:
                - web
      transformers:
        Buildconfig: m2kassets/inbuilt/transformers/kubernetes/buildconfig/buildconfig.yaml
        CloudFoundry: m2kassets/inbuilt/transformers/cloudfoundry/cloudfoundry.yaml
        ClusterSelector: m2kassets/inbuilt/transformers/kubernetes/clusterselector/clusterselector.yaml
        ComposeAnalyser: m2kassets/inbuilt/transformers/compose/composeanalyser/composeanalyser.yaml
        ComposeGenerator: m2kassets/inbuilt/transformers/compose/composegenerator/composegenerator.yaml
        ContainerImagesPushScriptGenerator: m2kassets/inbuilt/transformers/containerimage/containerimagespushscript/containerimagespushscript.yaml
        DockerfileDetector: m2kassets/inbuilt/transformers/dockerfile/dockerfiledetector/dockerfiledetector.yaml
        DockerfileImageBuildScript: m2kassets/inbuilt/transformers/dockerfile/dockerimagebuildscript/dockerfilebuildscriptgenerator.yaml
        DockerfileParser: m2kassets/inbuilt/transformers/dockerfile/dockerfileparser/dockerfileparser.yaml
        DotNetCore-Dockerfile: m2kassets/inbuilt/transformers/dockerfilegenerator/dotnetcore/dotnetcore.yaml
        EarAnalyser: m2kassets/inbuilt/transformers/dockerfilegenerator/java/earanalyser/ear.yaml
        EarRouter: m2kassets/inbuilt/transformers/dockerfilegenerator/java/earrouter/earrouter.yaml
        Golang-Dockerfile: m2kassets/inbuilt/transformers/dockerfilegenerator/golang/golang.yaml
        Gradle: m2kassets/inbuilt/transformers/dockerfilegenerator/java/gradle/gradle.yaml
        Jar: m2kassets/inbuilt/transformers/dockerfilegenerator/java/jar/jar.yaml
        Jboss: m2kassets/inbuilt/transformers/dockerfilegenerator/java/jboss/jboss.yaml
        Knative: m2kassets/inbuilt/transformers/kubernetes/knative/knative.yaml
        Kubernetes: m2kassets/inbuilt/transformers/kubernetes/kubernetes/kubernetes.yaml
        KubernetesVersionChanger: m2kassets/inbuilt/transformers/kubernetes/kubernetesversionchanger/kubernetesversionchanger.yaml
        Liberty: m2kassets/inbuilt/transformers/dockerfilegenerator/java/liberty/liberty.yaml
        Maven: m2kassets/inbuilt/transformers/dockerfilegenerator/java/maven/maven.yaml
        Nodejs-Dockerfile: m2kassets/inbuilt/transformers/dockerfilegenerator/nodejs/nodejs.yaml
        PHP-Dockerfile: m2kassets/inbuilt/transformers/dockerfilegenerator/php/php.yaml
        Parameterizer: m2kassets/inbuilt/transformers/kubernetes/parameterizer/parameterizer.yaml
        Python-Dockerfile: m2kassets/inbuilt/transformers/dockerfilegenerator/python/python.yaml
        ReadMeGenerator: m2kassets/inbuilt/transformers/readmegenerator/readmegenerator.yaml
        Ruby-Dockerfile: m2kassets/inbuilt/transformers/dockerfilegenerator/ruby/ruby.yaml
        Rust-Dockerfile: m2kassets/inbuilt/transformers/dockerfilegenerator/rust/rust.yaml
        Tekton: m2kassets/inbuilt/transformers/kubernetes/tekton/tekton.yaml
        Tomcat: m2kassets/inbuilt/transformers/dockerfilegenerator/java/tomcat/tomcat.yaml
        WarAnalyser: m2kassets/inbuilt/transformers/dockerfilegenerator/java/waranalyser/war.yaml
        WarRouter: m2kassets/inbuilt/transformers/dockerfilegenerator/java/warrouter/warrouter.yaml
        WinConsoleApp-Dockerfile: m2kassets/inbuilt/transformers/dockerfilegenerator/windows/winconsole/winconsole.yaml
        WinSLWebApp-Dockerfile: m2kassets/inbuilt/transformers/dockerfilegenerator/windows/winsilverlightweb/winsilverlightweb.yaml
        WinWebApp-Dockerfile: m2kassets/inbuilt/transformers/dockerfilegenerator/windows/winweb/winweb.yaml
        ZuulAnalyser: m2kassets/inbuilt/transformers/dockerfilegenerator/java/zuul/zuulanalyser.yaml
    ```

1. Now we can run the transformation phase. For most questions we go with the default answer. However, some questions to watch out for are:
    - The question about the URL path on which the `redis` service should be exposed. Since this service is not meant to be exposed we will give `:-` as suggested in the question hints. This makes sure the service port will not be exposed via the Ingress.
    - The questions about the URL path on which the web service should be exposed. Since most website frontends are built to be served under `/` we can give that here.
    - The question about registry URL and namespace. This is where the container images will be pushed after building.
    - The ingress host and TLS secret. If you are deploying to MiniKube give `localhost` as the host and leave the TLS secret blank.

    ```console
    $ move2kube transform
    INFO[0000] Detected a plan file at path /Users/user/Desktop/tutorial/m2k.plan. Will transform using this plan. 
    ? Select all transformer types that you are interested in:
    Hints:
    [Services that don't support any of the transformer types you are interested in will be ignored.]
     CloudFoundry, KubernetesVersionChanger, Rust-Dockerfile, WarAnalyser, EarAnalyser, Gradle, Jar, WinSLWebApp-Dockerfile, EarRouter, Nodejs-Dockerfile, PHP-Dockerfile,    ReadMeGenerator, Tekton, Tomcat, WarRouter, ZuulAnalyser, ContainerImagesPushScriptGenerator, Kubernetes, WinWebApp-Dockerfile, Buildconfig, DotNetCore-Dockerfile,   Python-Dockerfile, ComposeAnalyser, ComposeGenerator, DockerfileParser, Golang-Dockerfile, Knative, Maven, DockerfileImageBuildScript, Jboss, ClusterSelector,     DockerfileDetector, Liberty, Parameterizer, Ruby-Dockerfile, WinConsoleApp-Dockerfile
    ? Select all services that are needed:
    Hints:
    [The services unselected here will be ignored.]
     api, redis, web
    INFO[0002] Starting Plan Transformation                 
    INFO[0002] Iteration 1                                  
    INFO[0002] Iteration 2 - 3 artifacts to process         
    INFO[0002] Transformer ComposeAnalyser processing 3 artifacts 
    INFO[0002] Transformer ZuulAnalyser processing 2 artifacts 
    INFO[0002] Transformer ZuulAnalyser Done                
    INFO[0002] Transformer ComposeAnalyser Done             
    INFO[0002] Created 2 pathMappings and 4 artifacts. Total Path Mappings : 2. Total Artifacts : 3. 
    INFO[0002] Iteration 3 - 4 artifacts to process         
    INFO[0002] Transformer DockerfileImageBuildScript processing 3 artifacts 
    ? Select the container runtime to use :
    Hints:
    [The container runtime selected will be used in the scripts]
     docker
    INFO[0003] Transformer DockerfileImageBuildScript Done  
    INFO[0003] Transformer ClusterSelector processing 2 artifacts 
    ? Choose the cluster type:
    Hints:
    [Choose the cluster type you would like to target]
     Kubernetes
    INFO[0004] Transformer ClusterSelector Done             
    INFO[0004] Transformer Tekton processing 2 artifacts    
    ? What URL/path should we expose the service redis's 6379 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     :-
    ? What URL/path should we expose the service web's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /
    ? What URL/path should we expose the service api's 1234 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /api
    ? Provide the minimum number of replicas each service should have
    Hints:
    [If the value is 0 pods won't be started by default]
     2
    ? Enter the URL of the image registry : 
    Hints:
    [You can always change it later by changing the yamls.]
     quay.io
    ? Enter the namespace where the new images should be pushed : 
    Hints:
    [Ex : myproject]
     move2kube
    ? [quay.io] What type of container registry login do you want to use?
    Hints:
    [Docker login from config mode, will use the default config from your local machine.]
     No authentication
    ? Provide the ingress host domain
    Hints:
    [Ingress host domain is part of service URL]
     localhost
    ? Provide the TLS secret for ingress
    Hints:
    [Leave empty to use http]
    
    INFO[0021] Transformer Tekton Done                      
    INFO[0021] Transformer ClusterSelector processing 2 artifacts 
    INFO[0021] Transformer ClusterSelector Done             
    INFO[0021] Transformer Buildconfig processing 2 artifacts 
    INFO[0021] Transformer Buildconfig Done                 
    INFO[0021] Transformer ComposeGenerator processing 2 artifacts 
    INFO[0021] Transformer ComposeGenerator Done            
    INFO[0021] Transformer ClusterSelector processing 2 artifacts 
    INFO[0021] Transformer ClusterSelector Done             
    INFO[0021] Transformer Kubernetes processing 2 artifacts 
    INFO[0021] Transformer Kubernetes Done                  
    INFO[0021] Transformer ClusterSelector processing 2 artifacts 
    INFO[0021] Transformer ClusterSelector Done             
    INFO[0021] Transformer Knative processing 2 artifacts   
    INFO[0021] Transformer Knative Done                     
    INFO[0021] Created 31 pathMappings and 9 artifacts. Total Path Mappings : 33. Total Artifacts : 7. 
    INFO[0021] Iteration 4 - 9 artifacts to process         
    INFO[0021] Transformer ReadMeGenerator processing 4 artifacts 
    INFO[0021] Transformer ReadMeGenerator Done             
    INFO[0021] Transformer ContainerImagesPushScriptGenerator processing 2 artifacts 
    INFO[0021] Transformer ContainerImagesPushScriptGenerator Done 
    INFO[0021] Transformer Parameterizer processing 4 artifacts 
    INFO[0021] Transformer Parameterizer Done               
    INFO[0021] Created 14 pathMappings and 1 artifacts. Total Path Mappings : 47. Total Artifacts : 16. 
    INFO[0021] Iteration 5 - 1 artifacts to process         
    INFO[0021] Transformer ReadMeGenerator processing 2 artifacts 
    INFO[0021] Transformer ReadMeGenerator Done             
    INFO[0021] Plan Transformation done                     
    INFO[0021] Transformed target artifacts can be found at [/Users/user/Desktop/tutorial/myproject].
    ```

1. Now that the transformation has finished we can look at the output.

    ```console
    $ ls
    docker-compose		m2k.plan		m2kqacache.yaml		myproject docker-compose.zip	m2kconfig.yaml		multiple-services
    $ tree myproject/
    myproject/
    ├── Readme.md
    ├── deploy
    │   ├── cicd
    │   │   ├── tekton
    │   │   │   ├── myproject-clone-build-push-pipeline.yaml
    │   │   │   ├── myproject-clone-push-serviceaccount.yaml
    │   │   │   ├── myproject-git-event-triggerbinding.yaml
    │   │   │   ├── myproject-git-repo-eventlistener.yaml
    │   │   │   ├── myproject-image-registry-secret.yaml
    │   │   │   ├── myproject-ingress.yaml
    │   │   │   ├── myproject-run-clone-build-push-triggertemplate.yaml
    │   │   │   ├── myproject-tekton-triggers-admin-role.yaml
    │   │   │   ├── myproject-tekton-triggers-admin-rolebinding.yaml
    │   │   │   └── myproject-tekton-triggers-admin-serviceaccount.yaml
    │   │   └── tekton-parameterized
    │   │       ├── helm-chart
    │   │       │   └── myproject
    │   │       │       ├── Chart.yaml
    │   │       │       └── templates
    │   │       │           ├── myproject-clone-build-push-pipeline.yaml
    │   │       │           ├── myproject-clone-push-serviceaccount.yaml
    │   │       │           ├── myproject-git-event-triggerbinding.yaml
    │   │       │           ├── myproject-git-repo-eventlistener.yaml
    │   │       │           ├── myproject-image-registry-secret.yaml
    │   │       │           ├── myproject-ingress.yaml
    │   │       │           ├── myproject-run-clone-build-push-triggertemplate.yaml
    │   │       │           ├── myproject-tekton-triggers-admin-role.yaml
    │   │       │           ├── myproject-tekton-triggers-admin-rolebinding.yaml
    │   │       │           └── myproject-tekton-triggers-admin-serviceaccount.yaml
    │   │       ├── kustomize
    │   │       │   └── base
    │   │       │       ├── kustomization.yaml
    │   │       │       ├── myproject-clone-build-push-pipeline.yaml
    │   │       │       ├── myproject-clone-push-serviceaccount.yaml
    │   │       │       ├── myproject-git-event-triggerbinding.yaml
    │   │       │       ├── myproject-git-repo-eventlistener.yaml
    │   │       │       ├── myproject-image-registry-secret.yaml
    │   │       │       ├── myproject-ingress.yaml
    │   │       │       ├── myproject-run-clone-build-push-triggertemplate.yaml
    │   │       │       ├── myproject-tekton-triggers-admin-role.yaml
    │   │       │       ├── myproject-tekton-triggers-admin-rolebinding.yaml
    │   │       │       └── myproject-tekton-triggers-admin-serviceaccount.yaml
    │   │       └── openshift-template
    │   │           └── template.yaml
    │   ├── compose
    │   │   └── docker-compose.yaml
    │   ├── knative
    │   │   ├── api-service.yaml
    │   │   ├── redis-service.yaml
    │   │   └── web-service.yaml
    │   ├── knative-parameterized
    │   │   ├── helm-chart
    │   │   │   └── myproject
    │   │   │       ├── Chart.yaml
    │   │   │       └── templates
    │   │   │           ├── api-service.yaml
    │   │   │           ├── redis-service.yaml
    │   │   │           └── web-service.yaml
    │   │   ├── kustomize
    │   │   │   └── base
    │   │   │       ├── api-service.yaml
    │   │   │       ├── kustomization.yaml
    │   │   │       ├── redis-service.yaml
    │   │   │       └── web-service.yaml
    │   │   └── openshift-template
    │   │       └── template.yaml
    │   ├── yamls
    │   │   ├── api-deployment.yaml
    │   │   ├── api-service.yaml
    │   │   ├── myproject-ingress.yaml
    │   │   ├── redis-deployment.yaml
    │   │   ├── redis-service.yaml
    │   │   ├── web-deployment.yaml
    │   │   └── web-service.yaml
    │   └── yamls-parameterized
    │       ├── helm-chart
    │       │   └── myproject
    │       │       ├── Chart.yaml
    │       │       ├── templates
    │       │       │   ├── api-deployment.yaml
    │       │       │   ├── api-service.yaml
    │       │       │   ├── myproject-ingress.yaml
    │       │       │   ├── redis-deployment.yaml
    │       │       │   ├── redis-service.yaml
    │       │       │   ├── web-deployment.yaml
    │       │       │   └── web-service.yaml
    │       │       ├── values-dev.yaml
    │       │       ├── values-prod.yaml
    │       │       └── values-staging.yaml
    │       ├── kustomize
    │       │   ├── base
    │       │   │   ├── api-deployment.yaml
    │       │   │   ├── api-service.yaml
    │       │   │   ├── kustomization.yaml
    │       │   │   ├── myproject-ingress.yaml
    │       │   │   ├── redis-deployment.yaml
    │       │   │   ├── redis-service.yaml
    │       │   │   ├── web-deployment.yaml
    │       │   │   └── web-service.yaml
    │       │   └── overlays
    │       │       ├── dev
    │       │       │   ├── apps-v1-deployment-api.yaml
    │       │       │   ├── apps-v1-deployment-redis.yaml
    │       │       │   ├── apps-v1-deployment-web.yaml
    │       │       │   └── kustomization.yaml
    │       │       ├── prod
    │       │       │   ├── apps-v1-deployment-api.yaml
    │       │       │   ├── apps-v1-deployment-redis.yaml
    │       │       │   ├── apps-v1-deployment-web.yaml
    │       │       │   └── kustomization.yaml
    │       │       └── staging
    │       │           ├── apps-v1-deployment-api.yaml
    │       │           ├── apps-v1-deployment-redis.yaml
    │       │           ├── apps-v1-deployment-web.yaml
    │       │           └── kustomization.yaml
    │       └── openshift-template
    │           ├── parameters-dev.yaml
    │           ├── parameters-prod.yaml
    │           ├── parameters-staging.yaml
    │           └── template.yaml
    ├── scripts
    │   ├── builddockerimages.bat
    │   ├── builddockerimages.sh
    │   ├── pushimages.bat
    │   └── pushimages.sh
    └── source
        ├── api
        │   ├── Dockerfile
        │   ├── index.js
        │   ├── package-lock.json
        │   └── package.json
        ├── docker-compose.yaml
        └── web
            ├── Dockerfile
            ├── fib.php
            └── index.php

    35 directories, 101 files
    ```
    Inside the `scripts` directory we see some helpful scripts that Move2Kube has generated to help us build and push the container images we need.
    ```
1. Now we can build all the images using the `buildimages.sh` script.

    ```console
    $ ./builddockerimages.sh 
    [+] Building 4.3s (10/10) FINISHED                                                                                                                                
     => [internal] load build definition from Dockerfile                                                                                                         0.0s
     => => transferring dockerfile: 133B                                                                                                                         0.0s
     => [internal] load .dockerignore                                                                                                                            0.0s
     => => transferring context: 2B                                                                                                                              0.0s
     => [internal] load metadata for docker.io/library/node:14                                                                                                   2.5s
     => [auth] library/node:pull token for registry-1.docker.io                                                                                                  0.0s
     => [internal] load build context                                                                                                                            0.0s
     => => transferring context: 3.69kB                                                                                                                          0.0s
     => [1/4] FROM docker.io/library/node:14@sha256:e5c6aac226819f88d6431a56f502972d323d052b1b6108094ba7e6b07154a542                                             0.0s
     => CACHED [2/4] WORKDIR /app                                                                                                                                0.0s
     => [3/4] COPY . .                                                                                                                                           0.0s
     => [4/4] RUN npm install                                                                                                                                    1.5s
     => exporting to image                                                                                                                                       0.1s
     => => exporting layers                                                                                                                                      0.0s
     => => writing image sha256:d5a8e3d3f05592f6edefe5df286c31c2327dbde4ad3d5832fc059f1a9381157a                                                                 0.0s 
     => => naming to docker.io/library/fibonacci-api:latest                                                                                                      0.0s

    Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
    /Users/user/Desktop/tutorial/myproject
    [+] Building 2.5s (8/8) FINISHED                                                                                                                                  
     => [internal] load build definition from Dockerfile                                                                                                         0.0s
     => => transferring dockerfile: 82B                                                                                                                          0.0s
     => [internal] load .dockerignore                                                                                                                            0.0s
     => => transferring context: 2B                                                                                                                              0.0s
     => [internal] load metadata for docker.io/library/php:7-apache                                                                                              2.2s
     => [auth] library/php:pull token for registry-1.docker.io                                                                                                   0.0s
     => [internal] load build context                                                                                                                            0.0s
     => => transferring context: 1.51kB                                                                                                                          0.0s
     => CACHED [1/2] FROM docker.io/library/php:7-apache@sha256:729ad01c7d8e10fd992a6d4f3eb05dce3fb69bdf5c4fb4a9de4be4f4f5ae4dcc                                 0.0s
     => [2/2] COPY . /var/www/html/                                                                                                                              0.0s
     => exporting to image                                                                                                                                       0.0s
     => => exporting layers                                                                                                                                      0.0s
     => => writing image sha256:f5d91c6d96de3f8bb4c2c5d8bf6cde84985b7ee29d00ad21fad07e05cbe5ddca                                                                 0.0s
     => => naming to docker.io/library/fibonacci-web:latest                                                                                                      0.0s

    Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
    /Users/user/Desktop/tutorial/myproject
    done
    ```

1. Then we can push those images to the registry and namespace we selected using the `pushimages.sh` script.

    ```console
    $ ./pushimages.sh 
    The push refers to repository [quay.io/move2kube/fibonacci-web]
    29db8d44d6a6: Pushed 
    10dfb82106c4: Layer already exists 
    7446d340e7f8: Layer already exists 
    55d40777afe6: Layer already exists 
    56543a169be6: Layer already exists 
    b299cffd87cb: Layer already exists 
    23946094ff3f: Layer already exists 
    6c39776a30a0: Layer already exists 
    564928686313: Layer already exists 
    6e4300c6b758: Layer already exists 
    ee0ca96d307e: Layer already exists 
    0fdfbbf7aebd: Layer already exists 
    2a3138346faa: Layer already exists 
    2edcec3590a4: Layer already exists 
    latest: digest: sha256:b34a669c75afda3dd4b8d5ef264a6f818cb394bb147d754d6e1a8699798a4c70 size: 3242
    The push refers to repository [quay.io/move2kube/fibonacci-api]
    aef80d5c2943: Pushed 
    4471bdef8049: Pushed 
    5825d126ab35: Layer already exists 
    d48d998e8307: Layer already exists 
    1f95b68fc83b: Layer already exists 
    c1a45f6975fa: Layer already exists 
    be099ea57c79: Layer already exists 
    2b2dfe091b20: Layer already exists 
    df74cf750cc8: Layer already exists 
    75a95a2ddc29: Layer already exists 
    e8fb9c1faa8f: Layer already exists 
    9d1a9278f26b: Layer already exists 
    latest: digest: sha256:521be8d409c29414274c912600dc7606b7db591f69abb2fbfb5e402ccb547878 size: 2840
    ```

1. Skip this step if you have already have a Kubernetes cluster with Ingress enabled. Let's start MiniKube to start a local Kubernetes cluster on our machine.

    ```console
    $ minikube start
    😄  minikube v1.24.0 on Darwin 12.0.1
    ✨  Using the docker driver based on existing profile
    👍  Starting control plane node minikube in cluster minikube
    🚜  Pulling base image ...
    🏃  Updating the running docker "minikube" container ...
    🐳  Preparing Kubernetes v1.22.3 on Docker 20.10.8 ...
    🔎  Verifying Kubernetes components...
        ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
    💡  After the addon is enabled, please run "minikube tunnel" and your ingress resources would be available at "127.0.0.1"
        ▪ Using image k8s.gcr.io/ingress-nginx/controller:v1.0.4
        ▪ Using image k8s.gcr.io/ingress-nginx/kube-webhook-certgen:v1.1.1
        ▪ Using image k8s.gcr.io/ingress-nginx/kube-webhook-certgen:v1.1.1
    🔎  Verifying ingress addon...
    🌟  Enabled addons: storage-provisioner, default-storageclass, ingress
    🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
    ```
    Also enable the ingress addon
    ```console
    $ minikube addons enable ingress
    💡  After the addon is enabled, please run "minikube tunnel" and your ingress resources would be available at "127.0.0.1"
        ▪ Using image k8s.gcr.io/ingress-nginx/controller:v1.0.4
        ▪ Using image k8s.gcr.io/ingress-nginx/kube-webhook-certgen:v1.1.1
        ▪ Using image k8s.gcr.io/ingress-nginx/kube-webhook-certgen:v1.1.1
    🔎  Verifying ingress addon...
    🌟  The 'ingress' addon is enabled
    ```

1. Then we can deploy the Kubernetes YAMLs to our cluster. For this tutorial we will deploy to MiniKube since most people don't have a cluster.

    ```console
    $ kubectl apply -f deploy/yamls
    deployment.apps/api created
    service/api created
    ingress.networking.k8s.io/myproject created
    deployment.apps/redis created
    service/redis created
    deployment.apps/web created
    service/web created
    ```

1. Look at all the Kubernetes resources that were created.

    ```console
    $ kubectl get all
    NAME                        READY   STATUS    RESTARTS   AGE
    pod/api-84fc6cf59f-6z4nl    1/1     Running   0          8h
    pod/api-84fc6cf59f-72lmx    1/1     Running   0          8h
    pod/redis-5c94584bb-c9zk5   1/1     Running   0          8h
    pod/redis-5c94584bb-sv2zx   1/1     Running   0          8h
    pod/web-999d4cc74-6ckbj     1/1     Running   0          8h
    pod/web-999d4cc74-97hnc     1/1     Running   0          8h

    NAME                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
    service/api          ClusterIP   10.103.24.55    <none>        1234/TCP   8h
    service/kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP    12h
    service/redis        ClusterIP   None            <none>        <none>     8h
    service/web          ClusterIP   10.100.18.139   <none>        8080/TCP   8h

    NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
    deployment.apps/api     2/2     2            2           8h
    deployment.apps/redis   2/2     2            2           8h
    deployment.apps/web     2/2     2            2           8h

    NAME                              DESIRED   CURRENT   READY   AGE
    replicaset.apps/api-84fc6cf59f    2         2         2       8h
    replicaset.apps/redis-5c94584bb   2         2         2       8h
    replicaset.apps/web-999d4cc74     2         2         2       8h
    ```

1. To access our running application using the Ingress we created, we can start a tunnel to the MiniKube cluster.

    ```console
    $ minikube tunnel
    ❗  The service/ingress myproject requires privileged ports to be exposed: [80 443]
    🔑  sudo permission will be asked for it.
    🏃  Starting tunnel for service myproject.
    Password:
    ```

1. Now we can access the app on http://localhost

    ![Home page]({{ site.baseurl }}/assets/images/docker-compose/home-page.png)
    ![Input number]({{ site.baseurl }}/assets/images/docker-compose/input-number.png)
    ![Answer to input]({{ site.baseurl }}/assets/images/docker-compose/answer-to-input.png)
    ![Answer to input using the API]({{ site.baseurl }}/assets/images/docker-compose/answer-using-api.png)

## Conclusion

    In this tutorial we transformed a Docker Compose application with multiple services. We used Move2Kube to come up with a plan for migration, transform the input using the plan, generate the appropriate build scripts, Kubernetes YAMLs, etc. and deployed them to MiniKube. The steps for migrating from other platforms like Docker Swarm are similar.
