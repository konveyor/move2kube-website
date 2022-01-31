---
layout: default
title: "Creating windows containers for .NET applications (4.x .NET Framework) and deploying to Kubernetes"
permalink: /tutorials/dotnet/
parent: Tutorials
nav_order: 10
---

# Creating windows containers for .NET applications (4.x .NET Framework) and deploying to Kubernetes

## Description

In this tutorial, we will learn how containerize .NET applications developed for 4.x versions of .NET framework using windows containers and deploy them to Kubernetes cluster using Move2Kube. Here, we are going to use the sample [WCF](https://docs.microsoft.com/en-us/dotnet/framework/wcf/whats-wcf) service from [samples/wcfservice](https://github.com/konveyor/move2kube-demos/tree/main/samples/wcfservice).

## Prerequisites

1. Install [Move2Kube](/installation)

1. Kubernetes with [windows node support](https://kubernetes.io/docs/setup/production-environment/windows/user-guide-windows-containers/)

1. Download the `samples/wcfservice` sample from [move2kube-demos](https://github.com/konveyor/move2kube-demos) repository

    ```console
    $ curl https://move2kube.konveyor.io/scripts/download.sh | bash -s -- -d samples/wcfservice -r move2kube-demos
    ```

   ```console
   $ tree -L 2 wcfservice/
    wcfservice/
    ├── wcfservice
    │   ├── App.config
    │   ├── IWindowsSampleService.cs
    │   ├── Properties
    │   ├── WindowsSampleService.cs
    │   ├── wcfservice.cs
    │   └── wcfservice.csproj
    └── wcfservice.sln

    2 directories, 6 files
   ```

## Steps to generate target artifacts

We will be using the two stage process (*plan* and *transform*) for the transformation. Run these steps from the directory containing the `./wcfservice/` directory:

1. First we create a *plan* on how to transform the applications to run on Kubernetes. In the *plan* phase, Move2Kube is going to go through the source artifacts and going to come up with a *plan* for us.

    ```console
    $ move2kube plan -s wcfservice
    INFO[0000] Configuration loading done                   
    INFO[0000] Planning Transformation - Base Directory     
    INFO[0000] [CloudFoundry] Planning transformation       
    INFO[0000] [CloudFoundry] Done                          
    INFO[0000] [DockerfileDetector] Planning transformation 
    INFO[0000] [DockerfileDetector] Done                    
    INFO[0000] [ComposeAnalyser] Planning transformation    
    INFO[0000] [ComposeAnalyser] Done                       
    INFO[0000] [Base Directory] Identified 0 named services and 0 to-be-named services 
    INFO[0000] Transformation planning - Base Directory done 
    INFO[0000] Planning Transformation - Directory Walk     
    INFO[0000] Identified 1 named services and 0 to-be-named services in . 
    WARN[0000] Unable to find compatible ASP.NET Core target framework  hence skipping. 
    INFO[0000] Transformation planning - Directory Walk done 
    INFO[0000] [Directory Walk] Identified 1 named services and 0 to-be-named services 
    INFO[0000] [Named Services] Identified 1 named services 
    INFO[0000] No of services identified : 1                
    INFO[0000] Plan can be found at [/Users/padmanabha/go/src/github.com/seshapad/workdir/dotnet-legacy-test/m2k.plan].
    ```

    * It has created a *m2k.plan* which is essentially a yaml file. Let's see what is inside the *plan* file.
    ```yaml
        apiVersion: move2kube.konveyor.io/v1alpha1
        kind: Plan
        metadata:
        name: myproject
        spec:
        sourceDir: wcfservice
        services:
            wcfservice:
            - transformerName: WinConsoleApp-Dockerfile
                paths:
                AppConfigFilePathList:
                    - wcfservice/App.config
                ServiceDirPath:
                    - .
        transformers:
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

    * In the *plan*, you can see that Move2Kube has detected the WCF services (`wcfservice`) and relative path of the detected `/App.config`. 
    * Also, the *plan* file is saying that the applications can be transformed using Move2Kube's built-in `WinConsoleApp-Dockerfile` transformer.

2. Let's invoke `move2kube transform` on this *plan*.

    ```console
    $ move2kube transform
    INFO[0000] Detected a plan file at path /Users/padmanabha/go/src/github.com/seshapad/workdir/dotnet-legacy-test/m2k.plan. Will transform using this plan. 
    ? Select all transformer types that you are interested in:
    ID: move2kube.transformers.types
    Hints:
    [Services that don't support any of the transformer types you are interested in will be ignored.]
    [Use arrows to move, space to select, <right> to all, <left> to none, type to filter]
    [✓]  PHP-Dockerfile
    [✓]  Gradle
    [✓]  Kubernetes
    [✓]  Knative
    [✓]  Nodejs-Dockerfile
    [✓]  Tekton
    [✓]  ZuulAnalyser
    [✓]  ComposeAnalyser
    [✓]  Jar
    [✓]  Liberty
    [✓]  Python-Dockerfile
    [✓]  ContainerImagesPushScriptGenerator
    [✓]  Jboss
    [✓]  Parameterizer
    [✓]  WinSLWebApp-Dockerfile
    [✓]  Buildconfig
    [✓]  CloudFoundry
    [✓]  Ruby-Dockerfile
    [✓]  WinWebApp-Dockerfile
    [✓]  DockerfileDetector
    [✓]  Golang-Dockerfile
    [✓]  WinConsoleApp-Dockerfile
    [✓]  EarAnalyser
    [✓]  KubernetesVersionChanger
    [✓]  Maven
    [✓]  ClusterSelector
    [✓]  EarRouter
    [✓]  DockerfileParser
    [✓]  DotNetCore-Dockerfile
    [✓]  ReadMeGenerator
    [✓]  Rust-Dockerfile
    [✓]  Tomcat
    [✓]  WarAnalyser
    [✓]  ComposeGenerator
    [✓]  DockerfileImageBuildScript
    [✓]  WarRouter
    ```

    * Let's go ahead with the default answer by pressing `return` or `enter` key.

    ```console
    Hints:
    [Services that don't support any of the transformer types you are interested in will be ignored.]
    PHP-Dockerfile, Gradle, Kubernetes, Knative, Nodejs-Dockerfile, Tekton, ZuulAnalyser, ComposeAnalyser, Jar, Liberty, Python-Dockerfile, ContainerImagesPushScriptGenerator, Jboss, Parameterizer, WinSLWebApp-Dockerfile, Buildconfig, CloudFoundry, Ruby-Dockerfile, WinWebApp-Dockerfile, DockerfileDetector, Golang-Dockerfile, WinConsoleApp-Dockerfile, EarAnalyser, KubernetesVersionChanger, Maven, ClusterSelector, EarRouter, DockerfileParser, DotNetCore-Dockerfile, ReadMeGenerator, Rust-Dockerfile, Tomcat, WarAnalyser, ComposeGenerator, DockerfileImageBuildScript, WarRouter
    ? Select all services that are needed:
    ID: move2kube.services.[].enable
    Hints:
    [The services unselected here will be ignored.]
      [Use arrows to move, space to select, <right> to all, <left> to none, type to filter]
      [✓]  wcfservice
    ```

    * Here, we select all the services.

    ```console
    ? Select all services that are needed:
    ID: move2kube.services.[].enable
    Hints:
    [The services unselected here will be ignored.]
    wcfservice
    INFO[0233] Starting Plan Transformation                 
    INFO[0233] Iteration 1                                  
    INFO[0233] Iteration 2 - 1 artifacts to process         
    INFO[0233] Transformer WinConsoleApp-Dockerfile processing 1 artifacts 
    INFO[0233] Transformer WinConsoleApp-Dockerfile Done    
    INFO[0233] Created 2 pathMappings and 2 artifacts. Total Path Mappings : 2. Total Artifacts : 1. 
    INFO[0233] Iteration 3 - 2 artifacts to process         
    INFO[0233] Transformer DockerfileParser processing 1 artifacts 
    WARN[0233] Unable to find ports in Dockerfile : /var/folders/45/5wf_qgcs06gd_xpg6rzvbx0r0000gn/T/move2kube2980808479/environment-DockerfileParser-1624209065/2318519572/source/Dockerfile. Using default port 
    INFO[0233] Transformer ZuulAnalyser processing 2 artifacts 
    INFO[0233] Transformer ZuulAnalyser Done                
    INFO[0233] Transformer DockerfileParser Done            
    INFO[0233] Transformer DockerfileImageBuildScript processing 2 artifacts 
    ? Select the container runtime to use :
    ID: move2kube.containerruntime
    Hints:
    [The container runtime selected will be used in the scripts]
      [Use arrows to move, type to filter]
    > docker
      podman
    ```
  
    * Here, we select runtime of choice. In this case, we select `docker`.

    * At this point, the default port `8080` is detected and the user is prompted on the modality of exposing this port.

    ```console
    INFO[0346] Transformer DockerfileImageBuildScript Done  
    INFO[0346] Created 1 pathMappings and 4 artifacts. Total Path Mappings : 3. Total Artifacts : 3. 
    INFO[0346] Iteration 4 - 4 artifacts to process         
    INFO[0346] Transformer ComposeGenerator processing 2 artifacts 
    ? What URL/path should we expose the service wcfservice's 8080 port on?
    ID: move2kube.services."wcfservice"."8080".urlpath
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
    (/wcfservice) wcfservice
    ```

    * We leave out the leading `/` to use the first part `wcfservice` as subdomain (as specified in the *Hints*).

    ```console
    wcfservice
    ? Provide the minimum number of replicas each service should have
    ID: move2kube.minreplicas
    Hints:
    [If the value is 0 pods won't be started by default]
    (2) 
    ```

    * Let's go ahead with the default answer again, which means 2 replicas for the given service.

    ```console
    2
    ? Enter the URL of the image registry : 
    Hints:
    [You can always change it later by changing the yamls.]
      [Use arrows to move, type to filter]
      Other (specify custom option)
      index.docker.io
    > quay.io
      us.icr.io
    ```

    * Then CLI asks to select the registry where your images are hosted. Here, we are selecting `quay.io`. Select 'Other' if your registry name is not here.

    ```console
    quay.io
    ? Enter the namespace where the new images should be pushed :  
    Hints:
     [Ex : myproject]
     (myproject) m2k-tutorial
    ```

    ```console
     No authentication
    INFO[0793] Transformer ComposeGenerator Done            
    INFO[0793] Transformer ClusterSelector processing 2 artifacts 
    ? Choose the cluster type:
    ID: move2kube.target.clustertype
    Hints:
    [Choose the cluster type you would like to target]
        [Use arrows to move, type to filter]
        Openshift
        AWS-EKS
        Azure-AKS
        GCP-GKE
        IBM-IKS
        IBM-Openshift
        > Kubernetes
    ```

    * Now, it asks to select the cluster type you want to deploy to. Here, we select the `Kubernetes` cluster type.
    
    ```console
      Kubernetes
    INFO[0863] Transformer ClusterSelector Done             
    INFO[0863] Transformer Knative processing 2 artifacts   
    INFO[0863] Transformer Knative Done                     
    INFO[0863] Transformer ContainerImagesPushScriptGenerator processing 2 artifacts 
    INFO[0863] Transformer ContainerImagesPushScriptGenerator Done 
    INFO[0863] Transformer ClusterSelector processing 2 artifacts 
    INFO[0863] Transformer ClusterSelector Done             
    INFO[0863] Transformer Buildconfig processing 2 artifacts 
    INFO[0863] Transformer Buildconfig Done                 
    INFO[0863] Transformer ClusterSelector processing 2 artifacts 
    INFO[0863] Transformer ClusterSelector Done             
    INFO[0863] Transformer Kubernetes processing 2 artifacts 
    ? Provide the ingress host domain
    ID: move2kube.target.ingress.host
    Hints:
    [Ingress host domain is part of service URL]
        my-cluster-ingress-host-domain.com
    ```

    * CLI is now asking for the ingress hosting domain. It can be grabbed from the cluster you are going to deploy to. The ingress hosting domain will differ based on the cluster you are fetching from.

    ```console
     my-cluster-ingress-host-domain.com
    ? Provide the TLS secret for ingress
    ID: move2kube.target.ingress.tls
    Hints:
    [Leave empty to use http]

    ```

    * Then it asks information about your TLS secret. Here we go with the by-default by pressing the 'return' key.

    ```console
    INFO[0934] Transformer Kubernetes Done                  
    INFO[0934] Transformer ClusterSelector processing 2 artifacts 
    INFO[0934] Transformer ClusterSelector Done             
    INFO[0934] Transformer Tekton processing 2 artifacts    
    INFO[0934] Transformer Tekton Done                      
    INFO[0934] Created 27 pathMappings and 7 artifacts. Total Path Mappings : 30. Total Artifacts : 7. 
    INFO[0934] Iteration 5 - 7 artifacts to process         
    INFO[0934] Transformer Parameterizer processing 4 artifacts 
    INFO[0934] Transformer Parameterizer Done               
    INFO[0934] Transformer ReadMeGenerator processing 5 artifacts 
    INFO[0934] Transformer ReadMeGenerator Done             
    INFO[0935] Plan Transformation done                     
    INFO[0935] Transformed target artifacts can be found at [/Users/padmanabha/go/src/github.com/seshapad/workdir/dotnet-legacy-test/myproject]. 
    ```

Finally, the transformation is successful and the target artifacts can be found inside the `./myproject` directory. The overview of the structure of the *./myproject* directory can be seen by executing the below command.

```console
$  tree -L 3 myproject
myproject/
├── Readme.md
├── deploy
│   ├── cicd
│   │   ├── tekton
│   │   └── tekton-parameterized
│   ├── compose
│   │   └── docker-compose.yaml
│   ├── knative
│   │   └── wcfservice-service.yaml
│   ├── knative-parameterized
│   │   ├── helm-chart
│   │   ├── kustomize
│   │   └── openshift-template
│   ├── yamls
│   │   ├── myproject-ingress.yaml
│   │   ├── wcfservice-deployment.yaml
│   │   └── wcfservice-service.yaml
│   └── yamls-parameterized
│       ├── helm-chart
│       ├── kustomize
│       └── openshift-template
├── scripts
│   ├── builddockerimages.bat
│   ├── builddockerimages.sh
│   ├── pushimages.bat
│   └── pushimages.sh
└── source
    ├── Dockerfile
    ├── wcfservice
    │   ├── App.config
    │   ├── IWindowsSampleService.cs
    │   ├── Properties
    │   ├── WindowsSampleService.cs
    │   ├── wcfservice.cs
    │   └── wcfservice.csproj
    └── wcfservice.sln

19 directories, 17 files
```

So, Move2Kube has created all the deployment artifacts which are present inside the `./myproject` directory. The `./myproject/source` directory looks very similar to the directory `wcfservice` that we gave as input to Move2Kube. But, Move2Kube has essentially instrumented the source code with additional files. For example, it has added the `Dockerfile` for each of the transformed services and with these dockerfiles the applications can be containerized and then deployed to a Kubernetes cluster.

## What's different in the case of windows application
1.  First difference is in the deployment yaml of windows container images (see `myproject/deploy/yamls/wcfservice-deployment.yaml` in the above example) . The `nodeSelector` and `tolerations` ensures that the image is instantiated on a windows node in the Kubernetes cluster.
```
nodeSelector:
    kubernetes.io/os: windows
restartPolicy: Always
schedulerName: default-scheduler
securityContext: {}
terminationGracePeriodSeconds: 30
tolerations:
- effect: NoSchedule
    key: os
    value: Windows
```
2. Second difference is in the Dockerfile (see `myproject/source/Dockerfile` in the above example) for the windows service as shown below. The `FROM` instruction refers to windows container images and the `--platform` indicates that these images have to be built for a windows platform.
```yaml
    FROM --platform=windows/amd64 mcr.microsoft.com/dotnet/framework/sdk:4.8 As builder
    WORKDIR /app
    COPY . .
    RUN msbuild /p:Configuration=Release /p:OutputPath=/app/output

    FROM --platform=windows/amd64 mcr.microsoft.com/dotnet/framework/runtime:4.8
    WORKDIR /app
    COPY --from=builder /app/output/ .
    CMD wcfservice.exe
```

## Deploying the application to Kubernetes with the generated target artifacts
The steps involved to deploy a windows application is the same as any other application except that the container images have to be built on a windows machine with Docker Desktop set to [windows container mode](https://docs.docker.com/desktop/windows/#switch-between-windows-and-linux-containers). Please refer to [.NET core deployment section](/tutorials/netcore) for details.

## Conclusion

In this tutorial, we learnt how to quickly migrate multiple .NET applications which are developed on 4.x .NET framework, to Kubernetes using the target artifacts generated by Move2Kube.