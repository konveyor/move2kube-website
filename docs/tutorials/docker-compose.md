---
layout: default
title: "Migrating from Docker Compose to Kubernetes"
permalink: /tutorials/migrating-from-docker-compose-to-kubernetes
parent: Tutorials
nav_order: 5
---

# Migrating from Docker Compose to Kubernetes

### TLDR

```console
$ move2kube transform -s docker-compose
```

Move2Kube will automatically analyse all the yaml files in docker-compose directory and transform and create all artifacts required for deploying the application in Kubernetes.

## Prerequisites
1. Install the [Move2Kube CLI tool](https://move2kube.konveyor.io/installation/cli). This tutorial has been created with `v0.3.6` version of Move2Kube.

```console
$ MOVE2KUBE_TAG='v0.3.6' bash <(curl https://raw.githubusercontent.com/konveyor/move2kube/main/scripts/install.sh)
```

1. A Kubernetes cluster. If you don't have one, you can install [MiniKube](https://minikube.sigs.k8s.io/docs/start/).

## Overview

In this tutorial we will look at migrating an application written for Docker Compose to run on Kubernetes. We will be using the 2 [Docker Compose](https://github.com/konveyor/move2kube-demos/tree/main/samples/docker-compose) samples from the [move2kube-demos](https://github.com/konveyor/move2kube-demos) repo.

The [first sample](https://github.com/konveyor/move2kube-demos/tree/main/samples/docker-compose/single-service) is a web app with a single service using Nginx. It uses a prebuilt image.

The [second sample](https://github.com/konveyor/move2kube-demos/tree/main/samples/docker-compose/multiple-services) is more complicated. It's also a web app but it has 3 services. A frontend written in PHP for Apache, an API backend written for NodeJS and a service for caching the calculations performed by the backend. For the cache service we use a prebuilt Redis image.

Below we show the steps for migrating the second sample. The steps for the first sample are similar, except that since it uses prebuilt images, you can skip the build and push images portion.

## Steps

1. Download the `samples/docker-compose/multiple-services` sample.

  ```console
    $ curl https://move2kube.konveyor.io/scripts/download.sh | bash -s -- -d samples/docker-compose/multiple-services -r move2kube-demos

    $ ls
    multiple-services
  ```

1. Now we can run the planning phase.
    <details markdown="block">
    <summary markdown="block">
    ```console
    # click to see the output
    $ move2kube plan -s multiple-services/
    ```
    </summary>
    ```console
    $ move2kube plan -s multiple-services/
    INFO[0000] Configuration loading done
    INFO[0000] Start planning
    INFO[0000] Planning started on the base directory
    INFO[0000] [CloudFoundry] Planning
    INFO[0000] [CloudFoundry] Done
    INFO[0000] [ComposeAnalyser] Planning
    INFO[0000] Identified 3 named services and 0 to-be-named services
    INFO[0000] [ComposeAnalyser] Done
    INFO[0000] [DockerfileDetector] Planning
    INFO[0000] Identified 1 named services and 1 to-be-named services
    INFO[0000] [DockerfileDetector] Done
    INFO[0000] [Base Directory] Identified 4 named services and 1 to-be-named services
    INFO[0000] Planning finished on the base directory
    INFO[0000] Planning started on its sub directories
    INFO[0000] Identified 1 named services and 0 to-be-named services in api
    INFO[0000] Identified 1 named services and 0 to-be-named services in web
    INFO[0000] Planning finished on its sub directories
    INFO[0000] [Directory Walk] Identified 4 named services and 2 to-be-named services
    INFO[0000] [Named Services] Identified 3 named services
    INFO[0000] Planning done
    INFO[0000] No of services identified : 3
    INFO[0000] Plan can be found at [/Users/user/Desktop/tutorial/m2k.plan]
    ```
    </details>

1. We can inspect the plan to see that all 3 services were detected.

    ```console
    $ cat m2k.plan 
    ```
    <details markdown="block">
    <summary markdown="block">
    ```console
    # click to see the full plan yaml
    apiVersion: move2kube.konveyor.io/v1alpha1
    kind: Plan
    ......
    ```
    </summary>
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
              ServiceDirectories:
                - api
            configs:
              ComposeService:
                serviceName: api
          - transformerName: Nodejs-Dockerfile
            paths:
              ServiceDirectories:
                - api
          - transformerName: DockerfileDetector
            paths:
              Dockerfile:
                - api/Dockerfile
              ServiceDirectories:
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
              ServiceDirectories:
                - web
            configs:
              ComposeService:
                serviceName: web
          - transformerName: DockerfileDetector
            paths:
              Dockerfile:
                - web/Dockerfile
              ServiceDirectories:
                - web
          - transformerName: PHP-Dockerfile
            paths:
              ServiceDirectories:
                - web
      transformers:
        ArgoCD: m2kassets/built-in/transformers/kubernetes/argocd/transformer.yaml
        Buildconfig: m2kassets/built-in/transformers/kubernetes/buildconfig/transformer.yaml
        CloudFoundry: m2kassets/built-in/transformers/cloudfoundry/transformer.yaml
        ClusterSelector: m2kassets/built-in/transformers/kubernetes/clusterselector/transformer.yaml
        ComposeAnalyser: m2kassets/built-in/transformers/compose/composeanalyser/transformer.yaml
        ComposeGenerator: m2kassets/built-in/transformers/compose/composegenerator/transformer.yaml
        ContainerImagesPushScriptGenerator: m2kassets/built-in/transformers/containerimagespushscript/transformer.yaml
        DockerfileDetector: m2kassets/built-in/transformers/dockerfile/dockerfiledetector/transformer.yaml
        DockerfileImageBuildScript: m2kassets/built-in/transformers/dockerfile/dockerimagebuildscript/transformer.yaml
        DockerfileParser: m2kassets/built-in/transformers/dockerfile/dockerfileparser/transformer.yaml
        DotNetCore-Dockerfile: m2kassets/built-in/transformers/dockerfilegenerator/dotnetcore/transformer.yaml
        EarAnalyser: m2kassets/built-in/transformers/dockerfilegenerator/java/earanalyser/transformer.yaml
        EarRouter: m2kassets/built-in/transformers/dockerfilegenerator/java/earrouter/transformer.yaml
        Golang-Dockerfile: m2kassets/built-in/transformers/dockerfilegenerator/golang/transformer.yaml
        Gradle: m2kassets/built-in/transformers/dockerfilegenerator/java/gradle/transformer.yaml
        Jar: m2kassets/built-in/transformers/dockerfilegenerator/java/jar/transformer.yaml
        Jboss: m2kassets/built-in/transformers/dockerfilegenerator/java/jboss/transformer.yaml
        Knative: m2kassets/built-in/transformers/kubernetes/knative/transformer.yaml
        Kubernetes: m2kassets/built-in/transformers/kubernetes/kubernetes/transformer.yaml
        KubernetesVersionChanger: m2kassets/built-in/transformers/kubernetes/kubernetesversionchanger/transformer.yaml
        Liberty: m2kassets/built-in/transformers/dockerfilegenerator/java/liberty/transformer.yaml
        Maven: m2kassets/built-in/transformers/dockerfilegenerator/java/maven/transformer.yaml
        Nodejs-Dockerfile: m2kassets/built-in/transformers/dockerfilegenerator/nodejs/transformer.yaml
        PHP-Dockerfile: m2kassets/built-in/transformers/dockerfilegenerator/php/transformer.yaml
        Parameterizer: m2kassets/built-in/transformers/kubernetes/parameterizer/transformer.yaml
        Python-Dockerfile: m2kassets/built-in/transformers/dockerfilegenerator/python/transformer.yaml
        ReadMeGenerator: m2kassets/built-in/transformers/readmegenerator/transformer.yaml
        Ruby-Dockerfile: m2kassets/built-in/transformers/dockerfilegenerator/ruby/transformer.yaml
        Rust-Dockerfile: m2kassets/built-in/transformers/dockerfilegenerator/rust/transformer.yaml
        Tekton: m2kassets/built-in/transformers/kubernetes/tekton/transformer.yaml
        Tomcat: m2kassets/built-in/transformers/dockerfilegenerator/java/tomcat/transformer.yaml
        WarAnalyser: m2kassets/built-in/transformers/dockerfilegenerator/java/waranalyser/transformer.yaml
        WarRouter: m2kassets/built-in/transformers/dockerfilegenerator/java/warrouter/transformer.yaml
        WinConsoleApp-Dockerfile: m2kassets/built-in/transformers/dockerfilegenerator/windows/winconsole/transformer.yaml
        WinSLWebApp-Dockerfile: m2kassets/built-in/transformers/dockerfilegenerator/windows/winsilverlightweb/transformer.yaml
        WinWebApp-Dockerfile: m2kassets/built-in/transformers/dockerfilegenerator/windows/winweb/transformer.yaml
        ZuulAnalyser: m2kassets/built-in/transformers/dockerfilegenerator/java/zuul/transformer.yaml
    ```
    </details>

1. Now we can run the transformation phase. For most questions we go with the default answer. However, some questions to watch out for are:
    - The question about what kind of service/ingress should be created for the `redis` service. Here, select `ClusterIP` and this makes sure that the service port will not be exposed via the Ingress.
    - The questions about the URL path on which the `web` service should be exposed. Since most website frontends are built to be served under `/` we can give that here instead of `/web`.
    - The question about image registry URL and image registry namespace. The image registry URL is where the container images will be pushed after building like Docker Hub (index.docker.io), Quay (quay.io), IBM Cloud Container Registry (us.icr.io), etc. The `namespace` here means your username on your target image registry and it is not the Kubernetes cluster namespace.
    - The ingress host and TLS secret. If you are deploying to MiniKube give `localhost` as the ingress host domain. If you are deploying to Kubernetes cluster on IBM Cloud, then you can find your ingress subdomain on your cluster on IBM Cloud as shown here. You can leave the TLS secret blank.

      ![Ingress subdomain on IBM Cloud]({{ site.baseurl }}/assets/images/docker-compose/ingress-subdomain.png)

    <details markdown="block">
    <summary markdown="block">
    ```console
    # click to see the output
    $ move2kube transform
    ```
    </summary>
    ```console
    $ move2kube transform
    INFO[0000] Detected a plan file at path /Users/user/Desktop/tutorial/m2k.plan. Will transform using this plan.
    ? Select all transformer types that you are interested in:
    ID: move2kube.transformers.types
    Hints:
    - Services that don't support any of the transformer types you are interested in will be ignored.

     ArgoCD, Buildconfig, CloudFoundry, ClusterSelector, ComposeAnalyser, ComposeGenerator, ContainerImagesPushScriptGenerator, DockerfileDetector, DockerfileImageBuildScript, DockerfileParser, DotNetCore-Dockerfile, EarAnalyser, EarRouter, Golang-Dockerfile, Gradle, Jar, Jboss, Knative, Kubernetes, KubernetesVersionChanger, Liberty, Maven, Nodejs-Dockerfile, PHP-Dockerfile, Parameterizer, Python-Dockerfile, ReadMeGenerator, Ruby-Dockerfile, Rust-Dockerfile, Tekton, Tomcat, WarAnalyser, WarRouter, WinConsoleApp-Dockerfile, WinSLWebApp-Dockerfile, WinWebApp-Dockerfile, ZuulAnalyser
    ? Select all services that are needed:
    ID: move2kube.services.[].enable
    Hints:
    - The services unselected here will be ignored.

     api, redis, web
    INFO[0133] Iteration 1
    INFO[0133] Iteration 2 - 3 artifacts to process
    INFO[0133] Transformer ComposeAnalyser processing 3 artifacts
    INFO[0133] Transformer ZuulAnalyser processing 2 artifacts
    INFO[0133] Transformer ZuulAnalyser Done
    INFO[0133] Transformer ComposeAnalyser Done
    INFO[0133] Created 2 pathMappings and 4 artifacts. Total Path Mappings : 2. Total Artifacts : 3.
    INFO[0133] Iteration 3 - 4 artifacts to process
    INFO[0133] Transformer ClusterSelector processing 2 artifacts
    ? Choose the cluster type:
    ID: move2kube.target.clustertype
    Hints:
    - Choose the cluster type you would like to target

     Kubernetes
    INFO[0179] Transformer ClusterSelector Done
    INFO[0179] Transformer ArgoCD processing 2 artifacts
    ? What kind of service/ingress should be created for the service redis's 6379 port?
    ID: move2kube.services."redis"."6379".servicetype
    Hints:
    - Choose Ingress if you want a ingress/route resource to be created

     ClusterIP
    ? What kind of service/ingress should be created for the service api's 1234 port?
    ID: move2kube.services."api"."1234".servicetype
    Hints:
    - Choose Ingress if you want a ingress/route resource to be created

     Ingress
    ? Specify the ingress path to expose the service api's 1234 port on?
    ID: move2kube.services."api"."1234".urlpath
    Hints:
    - Leave out leading / to use first part as subdomain

    /api
    ? What kind of service/ingress should be created for the service web's 8080 port?
    ID: move2kube.services."web"."8080".servicetype
    Hints:
    - Choose Ingress if you want a ingress/route resource to be created

     Ingress
    ? Specify the ingress path to expose the service web's 8080 port on?
    ID: move2kube.services."web"."8080".urlpath
    Hints:
    - Leave out leading / to use first part as subdomain

    /
    ? Provide the minimum number of replicas each service should have
    ID: move2kube.minreplicas
    Hints:
    - If the value is 0 pods won't be started by default

     2
    ? Enter the URL of the image registry :
    ID: move2kube.target.imageregistry.url
    Hints:
    - You can always change it later by changing the yamls.

     quay.io
    ? Enter the namespace where the new images should be pushed :
    ID: move2kube.target.imageregistry.namespace
    Hints:
    - Ex : myproject

     move2kube
    ? [quay.io] What type of container registry login do you want to use?
    ID: move2kube.target.imageregistry.logintype
    Hints:
    - Docker login from config mode, will use the default config from your local machine.

     No authentication
    INFO[1487] Transformer ArgoCD Done
    INFO[1487] Transformer ClusterSelector processing 2 artifacts
    INFO[1487] Transformer ClusterSelector Done
    INFO[1487] Transformer Buildconfig processing 2 artifacts
    INFO[1487] Transformer Buildconfig Done
    INFO[1487] Transformer ComposeGenerator processing 2 artifacts
    INFO[1487] Transformer ComposeGenerator Done
    INFO[1487] Transformer DockerfileImageBuildScript processing 3 artifacts
    ? Select the container runtime to use :
    ID: move2kube.containerruntime
    Hints:
    - The container runtime selected will be used in the scripts

    docker
    INFO[1492] Transformer DockerfileImageBuildScript Done
    INFO[1492] Transformer ClusterSelector processing 2 artifacts
    INFO[1492] Transformer ClusterSelector Done
    INFO[1492] Transformer Knative processing 2 artifacts
    INFO[1492] Transformer Knative Done
    INFO[1492] Transformer ClusterSelector processing 2 artifacts
    INFO[1492] Transformer ClusterSelector Done
    INFO[1492] Transformer Kubernetes processing 2 artifacts
    ? Provide the ingress host domain
    ID: move2kube.target.ingress.host
    Hints:
    - Ingress host domain is part of service URL

    localhost
    ? Provide the TLS secret for ingress
    ID: move2kube.target.ingress.tls
    Hints:
    - Leave empty to use http


    INFO[1499] Transformer Kubernetes Done
    INFO[1499] Transformer ClusterSelector processing 2 artifacts
    INFO[1499] Transformer ClusterSelector Done
    INFO[1499] Transformer Tekton processing 2 artifacts
    INFO[1499] Transformer Tekton Done
    INFO[1499] Created 33 pathMappings and 11 artifacts. Total Path Mappings : 35. Total Artifacts : 7.
    INFO[1499] Iteration 4 - 11 artifacts to process
    INFO[1499] Transformer ContainerImagesPushScriptGenerator processing 2 artifacts
    INFO[1499] Transformer ContainerImagesPushScriptGenerator Done
    INFO[1499] Transformer Parameterizer processing 5 artifacts
    INFO[1499] Transformer Parameterizer Done
    INFO[1499] Transformer ReadMeGenerator processing 5 artifacts
    INFO[1500] Transformer ReadMeGenerator Done
    INFO[1500] Created 17 pathMappings and 1 artifacts. Total Path Mappings : 52. Total Artifacts : 18.
    INFO[1500] Iteration 5 - 1 artifacts to process
    INFO[1500] Transformer ReadMeGenerator processing 2 artifacts
    INFO[1500] Transformer ReadMeGenerator Done
    INFO[1500] Transformation done
    INFO[1500] Transformed target artifacts can be found at [/Users/user/Desktop/tutorial/myproject].
    ```
    </details>

1. Now that the transformation has finished we can look at the output.

    <details markdown="block">
    <summary markdown="block">
    ```console
    # click to see the output
    $ ls
    $ tree myproject/
    ```
    </summary>
    ```console
    $ ls
    docker-compose		m2k.plan		m2kqacache.yaml		myproject docker-compose.zip	m2kconfig.yaml		multiple-services
    $ tree myproject/
    myproject/
    ├── Readme.md
    ├── deploy
    │   ├── cicd
    │   │   ├── argocd
    │   │   │   └── myproject-deploy-application.yaml
    │   │   ├── argocd-parameterized
    │   │   │   ├── helm-chart
    │   │   │   │   └── myproject
    │   │   │   │       ├── Chart.yaml
    │   │   │   │       └── templates
    │   │   │   │           └── myproject-deploy-application.yaml
    │   │   │   ├── kustomize
    │   │   │   │   └── base
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── myproject-deploy-application.yaml
    │   │   │   └── openshift-template
    │   │   │       └── template.yaml
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

    43 directories, 107 files
    ```
    </details>
    Inside the `scripts` directory we see some helpful scripts that Move2Kube has generated to help us build and push the container images we need.

1. Now we can build all the images using the `builddockerimages.sh` script.

    <details markdown="block">
    <summary markdown="block">
    ```console
    # click to see the output
    $ cd myproject/
    $ ./builddockerimages.sh 
    ```
    </summary>
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
    </details>

1. Then we can push those images to the registry and namespace we selected using the `pushimages.sh` script.

    <details markdown="block">
    <summary markdown="block">
    ```console
    # click to see the output
    $ ./pushimages.sh
    ```
    </summary>
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
    </details>

    Please Note: If you are using Quay.io, make sure you change the pushed repositories `visibility` to `Public` or else the Kubernetes pods may fail to pull the images from the registry and could fail to start due to `ErrImagePullBack`.

      ![Quay repository visibility]({{ site.baseurl }}/assets/images/docker-compose/quay-repo-visibility.png)

1. If you have already have a Kubernetes cluster, then log in to your Kubernetes cluster. Else, start MiniKube to start a local Kubernetes cluster on our machine.

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

1. After logging in to your Kubernetes cluster or starting a MiniKube cluster, just check if you are able to run the kubectl related command.
    ```console
    $ kubectl get pods
    ```

1. Now, we can deploy the Kubernetes YAMLs to our Kubernetes/MiniKube cluster.

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

1. This step is required only if the app has been deployed on MiniKube cluster. To access our running application using the Ingress we created, we can start a tunnel to the MiniKube cluster.

    ```console
    $ minikube tunnel
    ❗  The service/ingress myproject requires privileged ports to be exposed: [80 443]
    🔑  sudo permission will be asked for it.
    🏃  Starting tunnel for service myproject.
    Password:
    ```

1. Now we can access the app on the ingress that we specified during the ingress host domain QA. (For MiniKube, it will be http://localhost).

    ![Home page]({{ site.baseurl }}/assets/images/docker-compose/home-page.png)
    ![Input number]({{ site.baseurl }}/assets/images/docker-compose/input-number.png)
    ![Answer to input]({{ site.baseurl }}/assets/images/docker-compose/answer-to-input.png)
    ![Answer to input using the API]({{ site.baseurl }}/assets/images/docker-compose/answer-using-api.png)

## Conclusion

  In this tutorial we transformed a Docker Compose application with multiple services. We used Move2Kube to come up with a plan for migration, transform the input using the plan, generate the appropriate build scripts, Kubernetes YAMLs, etc. and deployed them to MiniKube. The steps for migrating from other platforms like Docker Swarm are similar.
