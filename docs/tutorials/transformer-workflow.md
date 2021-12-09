---
layout: default
title: "Using a custom transformer"
permalink: /tutorials/cli/
parent: Tutorials
nav_order: 3
---

# Using a custom transformer

## Description

In this tutorial we will see how we can customize the transformations done by Move2Kube to match our requirements.
The transformations that Move2Kube does are done using modules called **Transformers**. Move2Kube has a set of built-in
transformers that it runs in a pipeline to generate all the outputs it produces, but we can make and add our own transformers to this pipeline.

Transformers are capable of generating files and folders, modifying the output of other transformers, asking the user questions
to guide the transformation, rearrange the output folder structure, etc.
Transformers can be written as:
    - a Starlark script
    - a container image
    - a native program (Python/Shell/Nodejs script, etc.)

For this tutorial we will take the simple use case of adding an annotation to the Ingress YAML that Move2Kube already generates.
There are several ways to accomplish this but here we will show how it can be done with a Starlark script.

> Note about Starlark: Starlark is a more restricted form of Python that allows it to be embedded in other programs.
See https://github.com/bazelbuild/starlark#tour for an example.
For more details https://github.com/bazelbuild/starlark/blob/master/spec.md

## Prerequisites

1. Follow the [tutorial on CLI](/tutorials/cli) first, to familiarize yourself with the transformation workflow and then come back to this tutorial.
We will be skipping over the steps that were already explained in detail over there.

1. We will use the same [language-platforms.zip](https://github.com/konveyor/move2kube-demos/raw/main/samples/language-platforms.zip) sample from the previous tutorials.

## Steps to use the CLI to do a transformation

1. Download and unzip the `language-platforms.zip` file.
    ```console
    $ curl -Lo language-platforms.zip https://github.com/konveyor/move2kube-demos/raw/main/samples/language-platforms.zip
        ...
    $ unzip language-platforms.zip 
        ...
    $ ls language-platforms
    golang		java-gradle	java-gradle-war	java-maven	java-maven-war	nodejs		php		python		ruby
    ```

1. Download the entire directory `add-annotation-simple` from https://github.com/konveyor/move2kube-transformers/tree/main/add-annotation-simple

    ```console
    $ mkdir add-annotation-simple
    $ curl -o add-annotation-simple/ingress-annotator.star https://raw.githubusercontent.com/konveyor/move2kube-transformers/main/add-annotation-simple/ingress-annotator.star
    $ curl -o add-annotation-simple/ingress-annotator.yaml https://raw.githubusercontent.com/konveyor/move2kube-transformers/main/add-annotation-simple/ingress-annotator.yaml
    ```

    This directory contains 2 files. There's a YAML file that tells Move2Kube the details of our transformer. If we look inside the yaml we see:

    ```yaml
    class: "Starlark"
    ```

    This tells Move2Kube that this is a transformer written in Starlark. [Starlark](https://github.com/bazelbuild/starlark#tour) is a language very similar to Python.
    Starlark scripts are stored in files with a `.star` extension. If we look inside the `ingress-annotator.star` file we will see the code that specifies the behaviour of our transformer.

1. Run `move2kube plan -s language-platforms -c add-annotation-simple` to start the planning. The `-s` flag specifies the source directory same as before.
The `-c` flag is used to specify the directory containing the customizations we want to apply. In this case we have a single transformer inside the `add-annotation-simple` directory.
If we want we can specify a directory containing multiple transformers using the same `-c` flag.

    ```console
    $ move2kube plan -s language-platforms -c add-annotation-simple/
    INFO[0000] Loading Configuration                        
    INFO[0000] [*configuration.ClusterMDLoader] Loading configuration 
    INFO[0000] [*configuration.ClusterMDLoader] Done        
    INFO[0000] Configuration loading done                   
    INFO[0000] Planning Transformation - Base Directory     
    INFO[0000] [ComposeAnalyser] Planning transformation    
    INFO[0000] [ComposeAnalyser] Done                       
    INFO[0000] [ZuulAnalyser] Planning transformation       
    INFO[0000] [ZuulAnalyser] Done                          
    INFO[0000] [CloudFoundry] Planning transformation       
    INFO[0000] [CloudFoundry] Done                          
    INFO[0000] [DockerfileDetector] Planning transformation 
    INFO[0000] [DockerfileDetector] Done                    
    INFO[0000] [Base Directory] Identified 0 namedservices and 0 unnamed transformer plans 
    INFO[0000] Transformation planning - Base Directory done 
    INFO[0000] Planning Transformation - Directory Walk     
    INFO[0000] Parsing GAV else : providedCompile 'javax.servlet:servlet-api:2.5' 
    INFO[0000] Parsing GAV else : runtime 'javax.servlet:jstl:1.1.2' 
    INFO[0000] Identified 1 namedservices and 0 unnamed transformer plans in java-gradle 
    INFO[0000] Identified 1 namedservices and 0 unnamed transformer plans in java-gradle-war 
    INFO[0000] Identified 1 namedservices and 0 unnamed transformer plans in java-maven 
    INFO[0000] Identified 1 namedservices and 0 unnamed transformer plans in java-maven-war 
    INFO[0000] Identified 1 namedservices and 0 unnamed transformer plans in nodejs 
    INFO[0000] Identified 1 namedservices and 0 unnamed transformer plans in php/php 
    INFO[0000] Identified 1 namedservices and 0 unnamed transformer plans in python 
    INFO[0000] Identified 1 namedservices and 0 unnamed transformer plans in ruby 
    INFO[0000] Transformation planning - Directory Walk done 
    INFO[0000] [Directory Walk] Identified 4 namedservices and 4 unnamed transformer plans 
    INFO[0000] [Named Services] Identified 8 namedservices  
    INFO[0000] No of services identified : 8                
    INFO[0000] Plan can be found at [/Users/user/Desktop/temp/m2k.plan]. 
    ```

1. Now let's look at the plan file we generated.

    ```console
    $ ls
    add-annotation-simple	language-platforms	language-platforms.zip	m2k.plan
    $ cat m2k.plan 
    ```

    ```yaml
    apiVersion: move2kube.konveyor.io/v1alpha1
    kind: Plan
    metadata:
      name: myproject
    spec:
      rootDir: language-platforms
      customizationsDir: add-annotation-simple/
      services:
        app:
          - artifact: Ruby-Dockerfile
            paths:
              ProjectPath:
                - ruby
        main:
          - artifact: Nodejs-Dockerfile
            paths:
              ProjectPath:
                - nodejs
        myproject-java-gradle:
          - artifact: Gradle
            paths:
              GradleBuildFile:
                - java-gradle/build.gradle
              ProjectPath:
                - java-gradle
            configs:
              Gradle:
                artifactType: jar
        myproject-java-gradle-war:
          - artifact: WarAnalyser
            paths:
              ProjectPath:
                - java-gradle-war
              War:
                - java-gradle-war/java-gradle-war.war
            configs:
              War:
                deploymentFile: java-gradle-war.war
                javaVersion: ""
                buildContainerName: ""
                deploymentFileDirInBuildContainer: ""
                envVariables: {}
        myproject-java-maven-war:
          - artifact: WarAnalyser
            paths:
              ProjectPath:
                - java-maven-war
              War:
                - java-maven-war/java-maven-war.war
            configs:
              War:
                deploymentFile: java-maven-war.war
                javaVersion: ""
                buildContainerName: ""
                deploymentFileDirInBuildContainer: ""
                envVariables: {}
        myproject-php:
          - artifact: PHP-Dockerfile
            paths:
              ProjectPath:
                - php/php
        myproject-python:
          - artifact: Python-Dockerfile
            paths:
              MainPythonFilesPathType: []
              ProjectPath:
                - python
              PythonFilesPathType:
                - python/main.py
              RequirementsTxtPathType:
                - python/requirements.txt
            configs:
              PythonConfig:
                IsDjangoProject: false
        simplewebapp:
          - artifact: Maven
            paths:
              MavenPom:
                - java-maven/pom.xml
              ProjectPath:
                - java-maven
            configs:
              Maven:
                mavenAppName: simplewebapp
                artifactType: war
      targetCluster:
        type: Kubernetes
      configuration:
        transformers:
          Buildconfig: m2kassets/inbuilt/transformers/kubernetes/buildconfig/buildconfig.yaml
          CloudFoundry: m2kassets/inbuilt/transformers/cloudfoundry/cloudfoundry.yaml
          ComposeAnalyser: m2kassets/inbuilt/transformers/compose/composeanalyser/composeanalyser.yaml
          ComposeGenerator: m2kassets/inbuilt/transformers/compose/composegenerator/composegenerator.yaml
          ContainerImagesBuildScriptGenerator: m2kassets/inbuilt/transformers/containerimage/containerimagesbuildscript/containerimagesbuildscript.yaml
          ContainerImagesPushScriptGenerator: m2kassets/inbuilt/transformers/containerimage/containerimagespushscript/containerimagespushscript.yaml
          DockerfileDetector: m2kassets/inbuilt/transformers/dockerfile/dockerfiledetector/dockerfiledetector.yaml
          DockerfileImageBuildScript: m2kassets/inbuilt/transformers/dockerfile/dockerimagebuildscript/dockerfilebuildscriptgenerator.yaml
          DockerfileParser: m2kassets/inbuilt/transformers/dockerfile/dockerfileparser/dockerfileparser.yaml
          DotNetCore-Dockerfile: m2kassets/inbuilt/transformers/dockerfilegenerator/dotnetcore/dotnetcore.yaml
          EarAnalyser: m2kassets/inbuilt/transformers/dockerfilegenerator/java/earanalyser/ear.yaml
          EarRouter: m2kassets/inbuilt/transformers/dockerfilegenerator/java/earrouter/earrouter.yaml
          EurekaReplaceEngine: m2kassets/inbuilt/transformers/dockerfilegenerator/java/eurekareplaceengine/eureka.yaml
          Golang-Dockerfile: m2kassets/inbuilt/transformers/dockerfilegenerator/golang/golang.yaml
          Gradle: m2kassets/inbuilt/transformers/dockerfilegenerator/java/gradle/gradle.yaml
          IngressAnnotator: m2kassets/custom/ingress-annotator.yaml
          Jar: m2kassets/inbuilt/transformers/dockerfilegenerator/java/jar/jar.yaml
          Jboss: m2kassets/inbuilt/transformers/dockerfilegenerator/java/jboss/jboss.yaml
          Knative: m2kassets/inbuilt/transformers/kubernetes/knative/knative.yaml
          Kubernetes: m2kassets/inbuilt/transformers/kubernetes/kubernetes/kubernetes.yaml
          Liberty: m2kassets/inbuilt/transformers/dockerfilegenerator/java/liberty/liberty.yaml
          Maven: m2kassets/inbuilt/transformers/dockerfilegenerator/java/maven/maven.yaml
          Nodejs-Dockerfile: m2kassets/inbuilt/transformers/dockerfilegenerator/nodejs/nodejs.yaml
          PHP-Dockerfile: m2kassets/inbuilt/transformers/dockerfilegenerator/php/php.yaml
          Parameterizer: m2kassets/inbuilt/transformers/kubernetes/parameterizers/parameterizers.yaml
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
        targetClusters:
          Kubernetes: m2kassets/inbuilt/clusters/kubernetes.yaml
          Openshift: m2kassets/inbuilt/clusters/openshift.yaml
    ```

    We see a section called `configuration` near the end of the file. It lists all the transformers that are going to be run. We can see the transformer we specifed:
    ```yaml
    IngressAnnotator: m2kassets/custom/ingress-annotator.yaml
    ```

1. Now let's run the transformation using `move2kube transform`. It will run all the usual transformers including our transformer.
Same as the other tutorials, we will just go with the default answers by pressing `Enter` for each question.

    ```console
    $ move2kube transform
    INFO[0000] Detected a plan file at path /Users/user/Desktop/temp/m2k.plan. Will transform using this plan. 
    ? Select all transformer types that you are interested in:
    Hints:
    [Services that don't support any of the transformer types you are interested in will be ignored.]
     ZuulAnalyser, Jboss, Python-Dockerfile, WarAnalyser, WinSLWebApp-Dockerfile, CloudFoundry, Knative, Liberty, Maven, Parameterizer, Rust-Dockerfile, EarAnalyser, Gradle, IngressAnnotator, Ruby-Dockerfile, Tekton,    EurekaReplaceEngine, Kubernetes, ReadMeGenerator, Buildconfig, ContainerImagesBuildScriptGenerator, DockerfileParser, WinWebApp-Dockerfile, ComposeAnalyser, DockerfileDetector, Nodejs-Dockerfile,   WinConsoleApp-Dockerfile, DotNetCore-Dockerfile, EarRouter, PHP-Dockerfile, Golang-Dockerfile, Jar, Tomcat, WarRouter, ComposeGenerator, ContainerImagesPushScriptGenerator, DockerfileImageBuildScript
    ? Choose the cluster type:
    Hints:
    [Choose the cluster type you would like to target]
     Kubernetes
    ? Select all services that are needed:
    Hints:
    [The services unselected here will be ignored.]
     main, myproject-java-gradle, myproject-java-gradle-war, myproject-java-maven-war, myproject-php, myproject-python, simplewebapp, app
    INFO[0004] Starting Plan Transformation                 
    INFO[0004] Iteration 1                                  
    INFO[0004] Iteration 2                                  
    INFO[0004] Transformer Ruby-Dockerfile processing 1 artifacts 
    ? Select port to be exposed for the service app :
    Hints:
    [Select Other if you want to expose the service app to some other port]
     8080
    INFO[0005] Created 2 pathMappings and 2 artifacts. Total Path Mappings : 2. Total Artifacts : 8. 
    INFO[0005] Transformer Ruby-Dockerfile Done             
    INFO[0005] Transformer Gradle processing 1 artifacts    
    INFO[0005] Parsing GAV else : providedCompile 'javax.servlet:servlet-api:2.5' 
    INFO[0005] Parsing GAV else : runtime 'javax.servlet:jstl:1.1.2' 
    ? Select port to be exposed for the service myproject-java-gradle :
    Hints:
    [Select Other if you want to expose the service myproject-java-gradle to some other port]
     8080
    INFO[0005] Created 1 pathMappings and 1 artifacts. Total Path Mappings : 3. Total Artifacts : 8. 
    INFO[0005] Transformer Gradle Done                      
    INFO[0005] Transformer Nodejs-Dockerfile processing 1 artifacts 
    ? Enter the port to be exposed for the service main: 
    Hints:
    [The service main will be exposed to the specified port]
     8080
    INFO[0006] Created 2 pathMappings and 2 artifacts. Total Path Mappings : 5. Total Artifacts : 8. 
    INFO[0006] Transformer Nodejs-Dockerfile Done           
    INFO[0006] Transformer Maven processing 1 artifacts     
    INFO[0006] Created 1 pathMappings and 1 artifacts. Total Path Mappings : 6. Total Artifacts : 8. 
    INFO[0006] Transformer Maven Done                       
    INFO[0006] Transformer Python-Dockerfile processing 1 artifacts 
    ? Select port to be exposed for the service myproject-python :
    Hints:
    [Select Other if you want to expose the service myproject-python to some other port]
     8080
    INFO[0006] Created 2 pathMappings and 2 artifacts. Total Path Mappings : 8. Total Artifacts : 8. 
    INFO[0006] Transformer Python-Dockerfile Done           
    INFO[0006] Transformer WarAnalyser processing 2 artifacts 
    INFO[0006] Created 0 pathMappings and 2 artifacts. Total Path Mappings : 8. Total Artifacts : 8. 
    INFO[0006] Transformer WarAnalyser Done                 
    INFO[0006] Transformer PHP-Dockerfile processing 1 artifacts 
    ? Enter the port to be exposed for the service myproject-php: 
    Hints:
    [The service myproject-php will be exposed to the specified port]
     8080
    INFO[0007] Created 2 pathMappings and 2 artifacts. Total Path Mappings : 10. Total Artifacts : 8. 
    INFO[0007] Transformer PHP-Dockerfile Done              
    INFO[0007] Iteration 3                                  
    INFO[0007] Transformer Jar processing 1 artifacts       
    INFO[0007] Created 2 pathMappings and 2 artifacts. Total Path Mappings : 12. Total Artifacts : 20. 
    INFO[0007] Transformer Jar Done                         
    INFO[0007] Transformer WarRouter processing 4 artifacts 
    ? Select the transformer to use for service simplewebapp
     Tomcat
    ? Select the transformer to use for service myproject-java-gradle-war
     Tomcat
    ? Select the transformer to use for service myproject-java-maven-war
     Tomcat
    INFO[0008] Created 0 pathMappings and 4 artifacts. Total Path Mappings : 12. Total Artifacts : 20. 
    INFO[0008] Transformer WarRouter Done                   
    INFO[0008] Transformer DockerfileParser processing 4 artifacts 
    INFO[0008] Created 0 pathMappings and 4 artifacts. Total Path Mappings : 12. Total Artifacts : 20. 
    INFO[0008] Transformer DockerfileParser Done            
    INFO[0008] Transformer DockerfileImageBuildScript processing 5 artifacts 
    INFO[0008] Created 1 pathMappings and 5 artifacts. Total Path Mappings : 13. Total Artifacts : 20. 
    INFO[0008] Transformer DockerfileImageBuildScript Done  
    INFO[0009] Iteration 4                                  
    INFO[0009] Transformer Knative processing 2 artifacts   
    INFO[0009] Begin Optimization                           
    ? What URL/path should we expose the service myproject-php's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /myproject-php
    ? What URL/path should we expose the service app's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /app
    ? What URL/path should we expose the service main's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /main
    ? What URL/path should we expose the service myproject-python's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /myproject-python
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
     myproject
    ? [quay.io] What type of container registry login do you want to use?
    Hints:
    [Docker login from config mode, will use the default config from your local machine.]
     No authentication
    INFO[0014] Optimization done                            
    INFO[0014] Begin Optimization                           
    INFO[0014] Optimization done                            
    INFO[0014] Created 8 pathMappings and 2 artifacts. Total Path Mappings : 21. Total Artifacts : 35. 
    INFO[0014] Transformer Knative Done                     
    INFO[0014] Transformer ContainerImagesPushScriptGenerator processing 2 artifacts 
    INFO[0014] Created 1 pathMappings and 1 artifacts. Total Path Mappings : 22. Total Artifacts : 35. 
    INFO[0014] Transformer ContainerImagesPushScriptGenerator Done 
    INFO[0014] Transformer Kubernetes processing 2 artifacts 
    INFO[0014] Begin Optimization                           
    INFO[0014] Optimization done                            
    ? Provide the ingress host domain
    Hints:
    [Ingress host domain is part of service URL]
     myproject.com
    ? Provide the TLS secret for ingress
    Hints:
    [Leave empty to use http]

    INFO[0015] Total transformed objects : 9                
    INFO[0015] Begin Optimization                           
    INFO[0015] Optimization done                            
    INFO[0015] Total transformed objects : 9                
    INFO[0015] Created 2 pathMappings and 2 artifacts. Total Path Mappings : 24. Total Artifacts : 35. 
    INFO[0015] Transformer Kubernetes Done                  
    INFO[0015] Transformer ContainerImagesBuildScriptGenerator processing 2 artifacts 
    INFO[0015] Created 2 pathMappings and 1 artifacts. Total Path Mappings : 26. Total Artifacts : 35. 
    INFO[0015] Transformer ContainerImagesBuildScriptGenerator Done 
    INFO[0015] Transformer Tomcat processing 4 artifacts    
    INFO[0015] Created 8 pathMappings and 8 artifacts. Total Path Mappings : 34. Total Artifacts : 35. 
    INFO[0015] Transformer Tomcat Done                      
    INFO[0015] Transformer Buildconfig processing 2 artifacts 
    INFO[0015] Begin Optimization                           
    INFO[0015] Optimization done                            
    INFO[0015] Created 0 pathMappings and 0 artifacts. Total Path Mappings : 34. Total Artifacts : 35. 
    INFO[0015] Transformer Buildconfig Done                 
    INFO[0015] Transformer ComposeGenerator processing 2 artifacts 
    INFO[0015] Begin Optimization                           
    INFO[0015] Optimization done                            
    INFO[0015] Begin Optimization                           
    INFO[0015] Optimization done                            
    INFO[0015] Created 2 pathMappings and 0 artifacts. Total Path Mappings : 36. Total Artifacts : 35. 
    INFO[0015] Transformer ComposeGenerator Done            
    INFO[0015] Transformer DockerfileParser processing 1 artifacts 
    INFO[0015] Created 0 pathMappings and 1 artifacts. Total Path Mappings : 36. Total Artifacts : 35. 
    INFO[0015] Transformer DockerfileParser Done            
    INFO[0015] Transformer DockerfileImageBuildScript processing 2 artifacts 
    INFO[0015] Created 1 pathMappings and 6 artifacts. Total Path Mappings : 37. Total Artifacts : 35. 
    INFO[0015] Transformer DockerfileImageBuildScript Done  
    INFO[0015] Transformer Tekton processing 2 artifacts    
    INFO[0016] Begin Optimization                           
    INFO[0016] Optimization done                            
    INFO[0016] Generating Tekton pipeline for CI/CD         
    INFO[0016] No remote git repos detected. You might want to configure the git repository links manually. 
    INFO[0016] Begin Optimization                           
    INFO[0016] Optimization done                            
    INFO[0016] Generating Tekton pipeline for CI/CD         
    INFO[0016] No remote git repos detected. You might want to configure the git repository links manually. 
    INFO[0016] Created 20 pathMappings and 2 artifacts. Total Path Mappings : 57. Total Artifacts : 35. 
    INFO[0016] Transformer Tekton Done                      
    INFO[0016] Iteration 5                                  
    INFO[0016] Transformer ReadMeGenerator processing 3 artifacts 
    INFO[0016] Created 1 pathMappings and 0 artifacts. Total Path Mappings : 58. Total Artifacts : 58. 
    INFO[0016] Transformer ReadMeGenerator Done             
    INFO[0016] Transformer Buildconfig processing 2 artifacts 
    INFO[0016] Begin Optimization                           
    ? What URL/path should we expose the service myproject-java-gradle's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /myproject-java-gradle
    INFO[0016] Optimization done                            
    INFO[0016] Created 0 pathMappings and 0 artifacts. Total Path Mappings : 58. Total Artifacts : 58. 
    INFO[0016] Transformer Buildconfig Done                 
    INFO[0016] Transformer ComposeGenerator processing 2 artifacts 
    INFO[0016] Begin Optimization                           
    INFO[0016] Optimization done                            
    INFO[0016] Begin Optimization                           
    INFO[0016] Optimization done                            
    INFO[0016] Created 2 pathMappings and 0 artifacts. Total Path Mappings : 60. Total Artifacts : 58. 
    INFO[0016] Transformer ComposeGenerator Done            
    INFO[0016] Transformer DockerfileParser processing 4 artifacts 
    INFO[0016] Created 0 pathMappings and 3 artifacts. Total Path Mappings : 60. Total Artifacts : 58. 
    INFO[0016] Transformer DockerfileParser Done            
    INFO[0016] Transformer DockerfileImageBuildScript processing 4 artifacts 
    INFO[0016] Created 1 pathMappings and 9 artifacts. Total Path Mappings : 61. Total Artifacts : 58. 
    INFO[0016] Transformer DockerfileImageBuildScript Done  
    INFO[0016] Transformer Tekton processing 2 artifacts    
    INFO[0017] Begin Optimization                           
    INFO[0017] Optimization done                            
    INFO[0017] Generating Tekton pipeline for CI/CD         
    INFO[0017] No remote git repos detected. You might want to configure the git repository links manually. 
    INFO[0017] Begin Optimization                           
    INFO[0017] Optimization done                            
    INFO[0017] Generating Tekton pipeline for CI/CD         
    INFO[0017] No remote git repos detected. You might want to configure the git repository links manually. 
    INFO[0017] Created 20 pathMappings and 2 artifacts. Total Path Mappings : 81. Total Artifacts : 58. 
    INFO[0017] Transformer Tekton Done                      
    INFO[0017] Transformer Knative processing 2 artifacts   
    INFO[0017] Begin Optimization                           
    INFO[0017] Optimization done                            
    INFO[0017] Begin Optimization                           
    INFO[0017] Optimization done                            
    INFO[0017] Created 10 pathMappings and 2 artifacts. Total Path Mappings : 91. Total Artifacts : 58. 
    INFO[0017] Transformer Knative Done                     
    INFO[0017] Transformer IngressAnnotator processing 6 artifacts 
    INFO[0017] Created 4 pathMappings and 6 artifacts. Total Path Mappings : 95. Total Artifacts : 58. 
    INFO[0017] Transformer IngressAnnotator Done            
    INFO[0017] Transformer ContainerImagesPushScriptGenerator processing 2 artifacts 
    INFO[0017] Created 1 pathMappings and 1 artifacts. Total Path Mappings : 96. Total Artifacts : 58. 
    INFO[0017] Transformer ContainerImagesPushScriptGenerator Done 
    INFO[0017] Transformer Kubernetes processing 2 artifacts 
    INFO[0017] Begin Optimization                           
    INFO[0017] Optimization done                            
    INFO[0017] Total transformed objects : 11               
    INFO[0017] Begin Optimization                           
    INFO[0017] Optimization done                            
    INFO[0017] Total transformed objects : 11               
    INFO[0017] Created 2 pathMappings and 2 artifacts. Total Path Mappings : 98. Total Artifacts : 58. 
    INFO[0017] Transformer Kubernetes Done                  
    INFO[0017] Transformer ContainerImagesBuildScriptGenerator processing 2 artifacts 
    INFO[0017] Created 2 pathMappings and 1 artifacts. Total Path Mappings : 100. Total Artifacts : 58. 
    INFO[0017] Transformer ContainerImagesBuildScriptGenerator Done 
    INFO[0017] Iteration 6                                  
    INFO[0017] Transformer ContainerImagesPushScriptGenerator processing 2 artifacts 
    INFO[0017] Created 1 pathMappings and 1 artifacts. Total Path Mappings : 101. Total Artifacts : 84. 
    INFO[0017] Transformer ContainerImagesPushScriptGenerator Done 
    INFO[0017] Transformer Kubernetes processing 2 artifacts 
    INFO[0017] Begin Optimization                           
    ? What URL/path should we expose the service myproject-java-gradle-war's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /myproject-java-gradle-war
    ? What URL/path should we expose the service simplewebapp's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /simplewebapp
    ? What URL/path should we expose the service myproject-java-maven-war's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /myproject-java-maven-war
    INFO[0019] Optimization done                            
    INFO[0019] Total transformed objects : 17               
    INFO[0019] Begin Optimization                           
    INFO[0019] Optimization done                            
    INFO[0019] Total transformed objects : 17               
    INFO[0019] Created 2 pathMappings and 2 artifacts. Total Path Mappings : 103. Total Artifacts : 84. 
    INFO[0019] Transformer Kubernetes Done                  
    INFO[0019] Transformer ContainerImagesBuildScriptGenerator processing 2 artifacts 
    INFO[0019] Created 2 pathMappings and 1 artifacts. Total Path Mappings : 105. Total Artifacts : 84. 
    INFO[0019] Transformer ContainerImagesBuildScriptGenerator Done 
    INFO[0019] Transformer ReadMeGenerator processing 6 artifacts 
    INFO[0019] Created 1 pathMappings and 0 artifacts. Total Path Mappings : 106. Total Artifacts : 84. 
    INFO[0019] Transformer ReadMeGenerator Done             
    INFO[0019] Transformer Buildconfig processing 2 artifacts 
    INFO[0019] Begin Optimization                           
    INFO[0019] Optimization done                            
    INFO[0019] Created 0 pathMappings and 0 artifacts. Total Path Mappings : 106. Total Artifacts : 84. 
    INFO[0019] Transformer Buildconfig Done                 
    INFO[0019] Transformer ComposeGenerator processing 2 artifacts 
    INFO[0019] Begin Optimization                           
    INFO[0019] Optimization done                            
    INFO[0019] Begin Optimization                           
    INFO[0019] Optimization done                            
    INFO[0019] Created 2 pathMappings and 0 artifacts. Total Path Mappings : 108. Total Artifacts : 84. 
    INFO[0019] Transformer ComposeGenerator Done            
    INFO[0019] Transformer Tekton processing 2 artifacts    
    INFO[0019] Begin Optimization                           
    INFO[0019] Optimization done                            
    INFO[0019] Generating Tekton pipeline for CI/CD         
    INFO[0019] No remote git repos detected. You might want to configure the git repository links manually. 
    INFO[0019] Begin Optimization                           
    INFO[0019] Optimization done                            
    INFO[0019] Generating Tekton pipeline for CI/CD         
    INFO[0019] No remote git repos detected. You might want to configure the git repository links manually. 
    INFO[0019] Created 20 pathMappings and 2 artifacts. Total Path Mappings : 128. Total Artifacts : 84. 
    INFO[0019] Transformer Tekton Done                      
    INFO[0019] Transformer Parameterizer processing 4 artifacts 
    INFO[0019] Created 12 pathMappings and 0 artifacts. Total Path Mappings : 140. Total Artifacts : 84. 
    INFO[0019] Transformer Parameterizer Done               
    INFO[0019] Transformer IngressAnnotator processing 6 artifacts 
    INFO[0019] Created 4 pathMappings and 6 artifacts. Total Path Mappings : 144. Total Artifacts : 84. 
    INFO[0019] Transformer IngressAnnotator Done            
    INFO[0019] Transformer Knative processing 2 artifacts   
    INFO[0019] Begin Optimization                           
    INFO[0019] Optimization done                            
    INFO[0019] Begin Optimization                           
    INFO[0019] Optimization done                            
    INFO[0019] Created 16 pathMappings and 2 artifacts. Total Path Mappings : 160. Total Artifacts : 84. 
    INFO[0019] Transformer Knative Done                     
    INFO[0020] Iteration 7                                  
    INFO[0020] Transformer IngressAnnotator processing 6 artifacts 
    INFO[0020] Created 4 pathMappings and 6 artifacts. Total Path Mappings : 164. Total Artifacts : 98. 
    INFO[0020] Transformer IngressAnnotator Done            
    INFO[0020] Transformer Parameterizer processing 4 artifacts 
    INFO[0020] Created 12 pathMappings and 0 artifacts. Total Path Mappings : 176. Total Artifacts : 98. 
    INFO[0020] Transformer Parameterizer Done               
    INFO[0020] Transformer ReadMeGenerator processing 6 artifacts 
    INFO[0020] Created 1 pathMappings and 0 artifacts. Total Path Mappings : 177. Total Artifacts : 98. 
    INFO[0020] Transformer ReadMeGenerator Done             
    INFO[0020] Iteration 8                                  
    INFO[0020] Transformer ReadMeGenerator processing 4 artifacts 
    INFO[0020] Created 1 pathMappings and 0 artifacts. Total Path Mappings : 178. Total Artifacts : 104. 
    INFO[0020] Transformer ReadMeGenerator Done             
    INFO[0020] Transformer Parameterizer processing 4 artifacts 
    INFO[0020] Created 12 pathMappings and 0 artifacts. Total Path Mappings : 190. Total Artifacts : 104. 
    INFO[0020] Transformer Parameterizer Done               
    INFO[0020] Plan Transformation done                     
    INFO[0020] Transformed target artifacts can be found at [/Users/user/Desktop/temp/myproject].
    ```

1. After the questions are finished, wait a few minutes for it to finish processing. Once it's done, we can see the output in the `myproject` directory.
We can take a look at the Ingress that was generated.

    ```console
    $ ls
    add-annotation-simple	language-platforms	language-platforms.zip	m2k.plan		m2kconfig.yaml		m2kqacache.yaml		myproject
    ibm-macbook-pro:temp user$ ls
    add-annotation-simple	language-platforms	language-platforms.zip	m2k.plan		m2kconfig.yaml		m2kqacache.yaml		myproject
    ibm-macbook-pro:temp user$ ls myproject/
    Readme.md	deploy		scripts		source
    ibm-macbook-pro:temp user$ ls myproject/deploy/
    cicd			compose			knative			knative-parameterized	yamls			yamls-parameterized
    ibm-macbook-pro:temp user$ ls myproject/deploy/yamls
    app-deployment.yaml				myproject-ingress.yaml				myproject-java-gradle-war-service.yaml		myproject-php-service.yaml			simplewebapp-service.yaml
    app-service.yaml				myproject-java-gradle-deployment.yaml		myproject-java-maven-war-deployment.yaml	myproject-python-deployment.yaml
    main-deployment.yaml				myproject-java-gradle-service.yaml		myproject-java-maven-war-service.yaml		myproject-python-service.yaml
    main-service.yaml				myproject-java-gradle-war-deployment.yaml	myproject-php-deployment.yaml			simplewebapp-deployment.yaml
    $ cat myproject/deploy/yamls/myproject-ingress.yaml 
    ```

    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      annotations:
        kubernetes.io/ingress.class: haproxy
      creationTimestamp: null
      labels:
        move2kube.konveyor.io/service: myproject
      name: myproject
    spec:
      rules:
      - host: myproject.com
        http:
          paths:
          - backend:
              service:
                name: myproject-java-gradle-war
                port:
                  name: port-8080
            path: /myproject-java-gradle-war
            pathType: Prefix
          - backend:
              service:
                name: simplewebapp
                port:
                  name: port-8080
            path: /simplewebapp
            pathType: Prefix
          - backend:
              service:
                name: myproject-java-maven-war
                port:
                  name: port-8080
            path: /myproject-java-maven-war
            pathType: Prefix
          - backend:
              service:
                name: app
                port:
                  name: port-8080
            path: /app
            pathType: Prefix
          - backend:
              service:
                name: main
                port:
                  name: port-8080
            path: /main
            pathType: Prefix
          - backend:
              service:
                name: myproject-python
                port:
                  name: port-8080
            path: /myproject-python
            pathType: Prefix
          - backend:
              service:
                name: myproject-php
                port:
                  name: port-8080
            path: /myproject-php
            pathType: Prefix
          - backend:
              service:
                name: myproject-java-gradle
                port:
                  name: port-8080
            path: /myproject-java-gradle
            pathType: Prefix
    status:
      loadBalancer: {}
    ```

    We see the annotation has been added to the Ingress YAML:

    ```yaml
    metadata:
      annotations:
        kubernetes.io/ingress.class: haproxy
    ```

  In the next part we will take a closer look at the files that make up the transformer.

## Transformer to add an annotation to Ingress YAMLs

### Transformer YAML

  Let start with `ingress-annotator.yaml` file https://github.com/konveyor/move2kube-transformers/blob/main/add-annotation-simple/ingress-annotator.yaml

  ```yaml
  apiVersion: move2kube.konveyor.io/v1alpha1
  kind: Transformer
  metadata:
    name: IngressAnnotator
    labels: 
      move2kube.konveyor.io/inbuilt: false
  spec:
    class: "Starlark"
    intercepts: ["KubernetesYamls"]
    config:
      starFile: "ingress-annotator.star"
  ```

  If you are not familiar with the YAML format then here's a quick tutorial https://www.redhat.com/en/topics/automation/what-is-yaml  
  If you are familar with Kubernetes YAML files then the first 5 lines should be look familiar to you.
  The `apiVersion` specifies the version of Move2Kube API that we are using. When we write transformers we can leave it as `move2kube.konveyor.io/v1alpha1` and not worry about it.
  The `kind` specifies the type of resource this file is about. In our case we are creating a `Transformer` to add an annotation.
  The `metadata` section specifies some metadata such as `name` and `labels`. These are mostly cosmetic but `labels` and `annotations` have some special uses that we will see later.
  The `spec` section specifies the details about the transformer.
  The `spec.class` specifies the type of the transformer. There are several types of transformers: (Starlark, Kubernetes, Parameterizer, etc.)
  In our case the transformer is written in Starlark.

  Transformers take artifacts as input and the output is also artifacts.
  The `spec.intercepts` specifies the artifacts that trigger our transformer. Our transformer will intercept all artifacts of type `KubernetesYamls` and modify it before they are sent to other transformers.
  The `spec.config` section allows us to configure the transformer class. In our case the transformer type `Starlark` exposes a field called `starFile`
  where we can specify the path to the `.star` file containing the code for the transformer. We will look at this Starlark script next.

### Transformer Starlark script

  Now let's look at the Starlark script https://github.com/konveyor/move2kube-transformers/blob/main/add-annotation-simple/ingress-annotator.star

  ```python
  def transform(new_artifacts, old_artifacts):
      pathMappings = []
      artifacts = []

      for v in new_artifacts:
          yamlsPath = v["paths"]["KubernetesYamls"][0]
          serviceName = v["name"]
          v["artifact"] = "KubernetesYamls"
          artifacts.append(v)
          fileList = fs.readdir(yamlsPath)
          yamlsBasePath = yamlsPath.split("/")[-1]
          # Create a path template for the service
          pathTemplateName = serviceName.replace("-", "") + yamlsBasePath
          tplPathData = {'PathTemplateName': pathTemplateName}
          {% raw %}pathMappings.append({'type': 'PathTemplate', 'sourcePath': '{{ OutputRel "' + yamlsPath + '" }}', 'templateConfig': tplPathData}){% endraw %}
          for f in fileList:
              filePath = fs.pathjoin(yamlsPath, f)
              s = fs.read(filePath)
              yamlData = yaml.loads(s)
              if yamlData['kind'] != 'Ingress':
                  continue
              if 'annotations' not in yamlData['metadata']:
                  yamlData['metadata']['annotations'] = {'kubernetes.io/ingress.class': 'haproxy'}
              else:
                  yamlData['metadata']['annotations']['kubernetes.io/ingress.class'] = 'haproxy'
              s = yaml.dumps(yamlData)
              fs.write(filePath, s)
              {% raw %}pathMappings.append({'type': 'Default', 'sourcePath': yamlsPath, 'destinationPath': "{{ ." + pathTemplateName + " }}"}){% endraw %}

      return {'pathMappings': pathMappings, 'artifacts': artifacts}
  ```

  Let's go through this line by line. Every transformer needs a transform function that actually does the transformation.
  ```python
  def transform(new_artifacts, old_artifacts):
  ```
  The transform function takes as input 2 arrays, `new_artifacts` and `old_artifacts`. All transformers act on artifacts.
  They take artifacts as input and produce artifacts as output. An artifact is an object which has a type, a name, some file paths and some data.
  In the previous YAML file we had `intercepts: ["KubernetesYamls"]` which tells Move2Kube to pass us artifacts which have the type `KubernetesYamls`.
  So the `new_artifacts` array contains artifacts that are of type `KubernetesYamls`.

  Next we iterate through all the artifacts in the array using a for loop.
  ```python
      for v in new_artifacts:
  ```

  Next we gets the list of paths from the artifact object that are for directories containing Kubernetes YAMLs.
  ```python
          yamlsPath = v["paths"]["KubernetesYamls"][0]
  ```
  We will skip over these lines for now
  ```python
          serviceName = v["name"]
          v["artifact"] = "KubernetesYamls"
          artifacts.append(v)
  ```
  We read the directory path given in the artifact. This directory contains a bunch of Kubernetes YAML files.
  ```python
          fileList = fs.readdir(yamlsPath)
  ```
  `fileList` now contains the filename of all the Kubernetes YAML files.

  We will skip over the next few lines
  ```python
          yamlsBasePath = yamlsPath.split("/")[-1]
          # Create a path template for the service
          pathTemplateName = serviceName.replace("-", "") + yamlsBasePath
          tplPathData = {'PathTemplateName': pathTemplateName}
          {% raw %}pathMappings.append({'type': 'PathTemplate', 'sourcePath': '{{ OutputRel "' + yamlsPath + '" }}', 'templateConfig': tplPathData}){% endraw %}
  ```
  and look at the inner for loop first. We iterate over the filenames of all the Kubernetes YAML files:
  ```python
          for f in fileList:
  ```
  We join the directory path with the filename to get the path to the file:
  ```python
              filePath = fs.pathjoin(yamlsPath, f)
  ```

  We read the file and get the contents as a string.
  ```python
              s = fs.read(filePath)
  ```

  We parse the string as YAML format. `yamlData` contains an object now.
  ```python
              yamlData = yaml.loads(s)
  ```

  Next we check to see if the Kubernetes YAML is an Ingress by checking the `kind` field.
  ```python
              if yamlData['kind'] != 'Ingress':
                  continue
  ```

  Finally we get to the part where we add the annotation.
  We check to see if the `annotations` field and if it doesn't have it then we can set it directly. Otherwise we preserve the existing set of annotations while adding our own.
  ```python
              if 'annotations' not in yamlData['metadata']:
                  yamlData['metadata']['annotations'] = {'kubernetes.io/ingress.class': 'haproxy'}
              else:
                  yamlData['metadata']['annotations']['kubernetes.io/ingress.class'] = 'haproxy'
  ```

  Now that we added the annotation we write it out to same file.
  ```python
              s = yaml.dumps(yamlData)
              fs.write(filePath, s)
  ```

  Now we need to talk about path mappings. Transformers run in a temporary directory by default. Writing out files in this directory won't affect the output of Move2Kube.
  In order for the transformer to affect the output of Move2Kube we need to create what is called a `Path Mapping`.
  Transformers can create and return both artifacts and path mappings.
  Path mappings can be used to copy the file from our temporary directory to the output directory of Move2Kube.
  ```python
              {% raw %}pathMappings.append({'type': 'Default', 'sourcePath': yamlsPath, 'destinationPath': "{{ ." + pathTemplateName + " }}"}){% endraw %}
  ```

  Finally after the for loops are finished we return the artifacts and path mappings that we created.
  ```python
      return {'pathMappings': pathMappings, 'artifacts': artifacts}
  ```

  This has been a high level overview of how we can write a transformer using Starlark to add an annotation to Ingress YAMLs.
  All the concepts we discussed in this tutorial are explained in more detail in the documentation.
