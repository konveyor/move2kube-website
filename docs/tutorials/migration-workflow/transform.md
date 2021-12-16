---
layout: default
title: "Transform"
permalink: /tutorials/migration-workflow/transform
parent: "Migration workflow"
grand_parent: Tutorials
nav_order: 3
---

# Transform

Now it's time to actually do the transformation according to the plan file we generated in the previous step. The transformation phase runs all of the transformers again, but this time the transformers will use the plan to generate the output files.

During the transformation the transformers might run into situations where it requires some more information to generate the output. In order to get the answer it will ask the user some questions. The questions range from yes/no to multiple choice to string input. Most questions also have a default answer.

Example: Some of the questions Move2Kube will ask is about the type of container registry where you want to push the images to.
It also needs to know the registry namespace, and any authentication necessary for pulling images from that registry.

If you want to skip the QA, you can use the `--qa-skip` flag. However rather than skipping the questions, you can give a config file that contains all of the answers using the `--config` flag.

After the transformation is finished, all the answers are written to a config file called `m2kconfig,yaml`. This can be used for later transformations.

The transformation phase produces all the output files we need including, the Dockerfiles, build scripts for containerizing  various services and Kubernetes Deployment, Service and Ingress YAMLs necessary for deploying our application to a Kubernetes cluster.

In addition Move2Kube also generate the CI/CD pipeline and parameterized versions of all those Kubernetes YAMLs (Helm chart, Kustomize YAMLs, Openshift templates, etc.) for various environments (dev, staging, prod, etc.).

## Prerequisites

1. Finish the previous [Plan](/tutorials/migration-workflow/plan) step before following the steps below.

## Transforming using the CLI

1. Run `move2kube transform` in the same directory as the plan file. This will detect the plan file and use it to find the source and customizations directory.

1. Answer all the questions as appropriate. For most questions we can go with the default answers. Some questions to watch out for are the one about the container registry you want to use. There's also a question that let's you change the ingress hostname and ingress TLS secret.

    ```console
    $ move2kube transform
    INFO[0000] Detected a plan file at path /Users/user/Desktop/demo2/m2k.plan. Will transform using this plan. 
    ? Select all transformer types that you are interested in:
    Hints:
    [Services that don't support any of the transformer types you are interested in will be ignored.]
     ContainerImagesPushScriptGenerator, DockerfileDetector, DotNetCore-Dockerfile, Nodejs-Dockerfile, WinConsoleApp-Dockerfile, WinSLWebApp-Dockerfile, PHP-Dockerfile,    Tomcat, Jar, Kubernetes, Ruby-Dockerfile, ZuulAnalyser, CloudFoundry, ClusterSelector, ComposeAnalyser, EarAnalyser, Gradle, Jboss, Liberty, Parameterizer,    ReadMeGenerator, Tekton, WinWebApp-Dockerfile, DockerfileParser, WarRouter, Buildconfig, ContainerImagesBuildScriptGenerator, DockerfileImageBuildScript, EarRouter,   Golang-Dockerfile, WarAnalyser, ComposeGenerator, EurekaReplaceEngine, Knative, Maven, Python-Dockerfile, Rust-Dockerfile
    ? Select all services that are needed:
    Hints:
    [The services unselected here will be ignored.]
     frontend, gateway, inventory, orders, config-utils, customers-tomcat
    INFO[0002] Starting Plan Transformation                 
    INFO[0002] Iteration 1                                  
    INFO[0002] Iteration 2 - 6 artifacts to process         
    INFO[0002] Transformer CloudFoundry processing 3 artifacts 
    WARN[0003] Ignoring artifact frontend of type Nodejs-Dockerfile in transformer CloudFoundry 
    WARN[0003] Ignoring artifact gateway of type Maven in transformer CloudFoundry 
    WARN[0003] Ignoring artifact orders of type Maven in transformer CloudFoundry 
    INFO[0003] Transformer CloudFoundry Done                
    INFO[0003] Transformer Maven processing 3 artifacts     
    ? Choose the Maven profile to be used for the service inventory
    Hints:
    [Selected Maven profiles will be used for setting configuration for the service inventory]
     local
    ? Select port to be exposed for the service inventory :
    Hints:
    [Select Other if you want to expose the service inventory to some other port]
     8080
    ? Select port to be exposed for the service config-utils :
    Hints:
    [Select Other if you want to expose the service config-utils to some other port]
     8080
    INFO[0007] Transformer Maven Done                       
    INFO[0007] Created 3 pathMappings and 6 artifacts from transform. 
    INFO[0007] Created 3 pathMappings and 6 artifacts. Total Path Mappings : 3. Total Artifacts : 6. 
    INFO[0007] Iteration 3 - 6 artifacts to process         
    INFO[0007] Transformer ClusterSelector processing 2 artifacts 
    ? Choose the cluster type:
    Hints:
    [Choose the cluster type you would like to target]
     Kubernetes
    INFO[0011] Transformer ClusterSelector Done             
    INFO[0011] Transformer Buildconfig processing 2 artifacts 
    ? What URL/path should we expose the service gateway's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service  type]
     /gateway
    ? What URL/path should we expose the service orders's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service  type]
     /orders
    ? What URL/path should we expose the service frontend's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service  type]
     /frontend
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
    INFO[0021] Transformer Buildconfig Done                 
    INFO[0021] Transformer ClusterSelector processing 2 artifacts 
    INFO[0021] Transformer ClusterSelector Done             
    INFO[0021] Transformer Knative processing 2 artifacts   
    INFO[0021] Transformer Knative Done                     
    INFO[0021] Transformer ComposeGenerator processing 2 artifacts 
    INFO[0021] Transformer ComposeGenerator Done            
    INFO[0021] Transformer Jar processing 2 artifacts       
    INFO[0021] Transformer Jar Done                         
    INFO[0021] Transformer ClusterSelector processing 2 artifacts 
    INFO[0021] Transformer ClusterSelector Done             
    INFO[0021] Transformer Kubernetes processing 2 artifacts 
    ? Provide the ingress host domain
    Hints:
    [Ingress host domain is part of service URL]
     localhost
    ? Provide the TLS secret for ingress
    Hints:
    [Leave empty to use http]
    
    INFO[0025] Total transformed objects : 7                
    INFO[0025] Total transformed objects : 7                
    INFO[0025] Transformer Kubernetes Done                  
    INFO[0025] Transformer Tomcat processing 1 artifacts    
    INFO[0025] Transformer Tomcat Done                      
    INFO[0025] Transformer WarRouter processing 2 artifacts 
    ? Select the transformer to use for service customers-tomcat
     Liberty
    INFO[0026] Transformer WarRouter Done                   
    INFO[0026] Transformer Liberty processing 1 artifacts   
    INFO[0026] Transformer Liberty Done                     
    INFO[0026] Transformer ClusterSelector processing 2 artifacts 
    INFO[0026] Transformer ClusterSelector Done             
    INFO[0026] Transformer Tekton processing 2 artifacts    
    INFO[0026] Generating Tekton pipeline for CI/CD         
    INFO[0026] No remote git repos detected. You might want to configure the git repository links manually. 
    INFO[0026] Generating Tekton pipeline for CI/CD         
    INFO[0026] No remote git repos detected. You might want to configure the git repository links manually. 
    INFO[0026] Transformer Tekton Done                      
    INFO[0026] Transformer Jboss processing 1 artifacts     
    INFO[0026] Transformer Jboss Done                       
    INFO[0026] Created 40 pathMappings and 18 artifacts from transform. 
    INFO[0026] Created 40 pathMappings and 18 artifacts. Total Path Mappings : 43. Total Artifacts : 12. 
    INFO[0026] Iteration 4 - 18 artifacts to process        
    INFO[0026] Transformer DockerfileParser processing 5 artifacts 
    INFO[0027] Transformer DockerfileParser Done            
    INFO[0027] Transformer DockerfileImageBuildScript processing 4 artifacts 
    INFO[0027] Transformer DockerfileImageBuildScript Done  
    INFO[0027] Transformer ReadMeGenerator processing 4 artifacts 
    INFO[0027] Transformer ReadMeGenerator Done             
    INFO[0027] Transformer Liberty processing 2 artifacts   
    INFO[0027] Transformer Liberty Done                     
    INFO[0027] Transformer Parameterizer processing 4 artifacts 
    INFO[0027] Transformer Parameterizer Done               
    INFO[0027] Created 18 pathMappings and 11 artifacts from transform. 
    INFO[0027] Created 18 pathMappings and 11 artifacts. Total Path Mappings : 61. Total Artifacts : 30. 
    INFO[0027] Iteration 5 - 11 artifacts to process        
    INFO[0027] Transformer ClusterSelector processing 2 artifacts 
    INFO[0028] Transformer ClusterSelector Done             
    INFO[0028] Transformer Buildconfig processing 2 artifacts 
    ? What URL/path should we expose the service config-utils's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service  type]
     /config-utils
    ? What URL/path should we expose the service inventory's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service  type]
     /inventory
    ? What URL/path should we expose the service customers-tomcat's 9080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service  type]
     /customers-tomcat
    INFO[0032] Transformer Buildconfig Done                 
    INFO[0032] Transformer ClusterSelector processing 2 artifacts 
    INFO[0032] Transformer ClusterSelector Done             
    INFO[0032] Transformer Knative processing 2 artifacts   
    INFO[0032] Transformer Knative Done                     
    INFO[0032] Transformer ContainerImagesPushScriptGenerator processing 2 artifacts 
    INFO[0032] Transformer ContainerImagesPushScriptGenerator Done 
    INFO[0032] Transformer DockerfileParser processing 2 artifacts 
    INFO[0032] Transformer DockerfileParser Done            
    INFO[0032] Transformer ComposeGenerator processing 2 artifacts 
    INFO[0032] Transformer ComposeGenerator Done            
    INFO[0032] Transformer ClusterSelector processing 2 artifacts 
    INFO[0032] Transformer ClusterSelector Done             
    INFO[0032] Transformer Kubernetes processing 2 artifacts 
    INFO[0032] Total transformed objects : 13               
    INFO[0032] Total transformed objects : 13               
    INFO[0032] Transformer Kubernetes Done                  
    INFO[0032] Transformer ContainerImagesBuildScriptGenerator processing 2 artifacts 
    INFO[0033] Transformer ContainerImagesBuildScriptGenerator Done 
    INFO[0033] Transformer DockerfileImageBuildScript processing 2 artifacts 
    INFO[0033] Transformer DockerfileImageBuildScript Done  
    INFO[0033] Transformer ClusterSelector processing 2 artifacts 
    INFO[0033] Transformer ClusterSelector Done             
    INFO[0033] Transformer Tekton processing 2 artifacts    
    INFO[0033] Generating Tekton pipeline for CI/CD         
    INFO[0033] No remote git repos detected. You might want to configure the git repository links manually. 
    INFO[0033] Generating Tekton pipeline for CI/CD         
    INFO[0033] No remote git repos detected. You might want to configure the git repository links manually. 
    INFO[0033] Transformer Tekton Done                      
    INFO[0033] Created 40 pathMappings and 13 artifacts from transform. 
    INFO[0033] Created 40 pathMappings and 13 artifacts. Total Path Mappings : 101. Total Artifacts : 41. 
    INFO[0033] Iteration 6 - 13 artifacts to process        
    INFO[0033] Transformer ClusterSelector processing 2 artifacts 
    INFO[0033] Transformer ClusterSelector Done             
    INFO[0033] Transformer Kubernetes processing 2 artifacts 
    INFO[0033] Total transformed objects : 13               
    INFO[0034] Total transformed objects : 13               
    INFO[0034] Transformer Kubernetes Done                  
    INFO[0034] Transformer ContainerImagesBuildScriptGenerator processing 2 artifacts 
    INFO[0034] Transformer ContainerImagesBuildScriptGenerator Done 
    INFO[0034] Transformer ReadMeGenerator processing 6 artifacts 
    INFO[0034] Transformer ReadMeGenerator Done             
    INFO[0034] Transformer ClusterSelector processing 2 artifacts 
    INFO[0034] Transformer ClusterSelector Done             
    INFO[0034] Transformer Tekton processing 2 artifacts    
    INFO[0034] Generating Tekton pipeline for CI/CD         
    INFO[0034] No remote git repos detected. You might want to configure the git repository links manually. 
    INFO[0034] Generating Tekton pipeline for CI/CD         
    INFO[0034] No remote git repos detected. You might want to configure the git repository links manually. 
    INFO[0034] Transformer Tekton Done                      
    INFO[0034] Transformer Parameterizer processing 4 artifacts 
    INFO[0035] Transformer Parameterizer Done               
    INFO[0035] Transformer ClusterSelector processing 2 artifacts 
    INFO[0035] Transformer ClusterSelector Done             
    INFO[0035] Transformer Buildconfig processing 2 artifacts 
    INFO[0035] Transformer Buildconfig Done                 
    INFO[0035] Transformer ClusterSelector processing 2 artifacts 
    INFO[0035] Transformer ClusterSelector Done             
    INFO[0035] Transformer Knative processing 2 artifacts   
    INFO[0035] Transformer Knative Done                     
    INFO[0035] Transformer ContainerImagesPushScriptGenerator processing 2 artifacts 
    INFO[0035] Transformer ContainerImagesPushScriptGenerator Done 
    INFO[0035] Transformer ComposeGenerator processing 2 artifacts 
    INFO[0036] Transformer ComposeGenerator Done            
    INFO[0036] Created 52 pathMappings and 8 artifacts from transform. 
    INFO[0036] Created 52 pathMappings and 8 artifacts. Total Path Mappings : 153. Total Artifacts : 54. 
    INFO[0036] Iteration 7 - 8 artifacts to process         
    INFO[0036] Transformer ReadMeGenerator processing 6 artifacts 
    INFO[0036] Transformer ReadMeGenerator Done             
    INFO[0036] Transformer Parameterizer processing 4 artifacts 
    INFO[0036] Transformer Parameterizer Done               
    INFO[0036] Created 13 pathMappings and 0 artifacts from transform. 
    INFO[0037] Plan Transformation done                     
    INFO[0037] Transformed target artifacts can be found at [/Users/user/Desktop/demo2/myproject]. 
    ```

## Transforming using the UI

1. Continuing from the previous step in the UI. Scrolling down from the plan section we see the `outputs` section. Click the `start transformation` button.

    ![No project inputs]({{ site.baseurl }}/assets/images/migration-workflow/15-no-project-outputs.png)

1. This brings up a modal to ask the user some questions to guide the transformation.

    ![QA 1]({{ site.baseurl }}/assets/images/migration-workflow/16-qa-1.png)
    ![QA 2]({{ site.baseurl }}/assets/images/migration-workflow/17-qa-2.png)
    ![QA 3]({{ site.baseurl }}/assets/images/migration-workflow/18-qa-3.png)

1. Answer all the questions as appropriate. For most questions we can go with the default answers. Some questions to watch out for are the one about the container registry you want to use. There's also a question that let's you change the ingress hostname and ingress TLS secret.

1. After you answer all the questions, wait a few minutes for it to stop processing. Now the output should appear. Click on it to download the output.

    ![New project output]({{ site.baseurl }}/assets/images/migration-workflow/19-new-project-output.png)
    ![Download the project output]({{ site.baseurl }}/assets/images/migration-workflow/20-download-project-output.png)

## Using the output generated by Move2Kube transform

Now that we have generated the output we can run `buildimages.sh` to build all the service images, use `pushimages.sh` to push them to a container registry and deploy the Kubernetes yamls using `kubectl apply -f deploy/yamls`.

## Next steps

However after inspecting the output we might see some things we want to change. For example, we might want to add some annotations to the Ingress, maybe change the output directory structure, change which values are parameterized in the Helm chart, generate some new files, etc. For all these user specific requirements and more we can write our own custom transformers.

Next step [Custom transformer for changing base image](/tutorials/migration-workflow/base-image-change)
