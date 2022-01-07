---
layout: default
title: "Transform"
permalink: /tutorials/migration-workflow/transform
parent: "Migrating Enterprise Scale Cloud Foundry Apps to Kubernetes"
grand_parent: Tutorials
nav_order: 2
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

1. Run `move2kube transform` in the same directory as the plan file. This will detect the plan file and use it to find the source directory.

1. Answer all the questions as appropriate. For most questions we can go with the default answers. Some questions to watch out for are:
    - An extra spurious service called `config-utils` was detected by one of the transformers. We can deselect it when we are asked to select the services we are interested in. Again, we could have done this by editing the plan file.
    - Move2Kube has detected the Maven profiles for each of the Java services. If you are deploying to MiniKube then select the `local` profile. Similar questions for the SpringBoot profiles.
    - The container registry and namespace that you want to use. A container registry is where all the images are stored (Example: Quay, Docker Hub, etc.)
    - The ingress hostname and ingress TLS secret. If you are deploying to MiniKube then give `localhost` as the ingress host and leave the TLS secret blank.

    ```console
    $ move2kube transform
    INFO[0000] Detected a plan file at path /Users/user/Desktop/tutorial/m2k.plan. Will transform using this plan. 
    ? Select all transformer types that you are interested in:
    Hints:
    [Services that don't support any of the transformer types you are interested in will be ignored.]
     ComposeGenerator, Maven, Nodejs-Dockerfile, ReadMeGenerator, WarAnalyser, WinSLWebApp-Dockerfile, WinWebApp-Dockerfile, Buildconfig, Golang-Dockerfile,    KubernetesVersionChanger, Python-Dockerfile, Tekton, WinConsoleApp-Dockerfile, ContainerImagesPushScriptGenerator, Jboss, Rust-Dockerfile, Tomcat, DotNetCore-Dockerfile,  DockerfileDetector, EarAnalyser, Knative, Liberty, PHP-Dockerfile, ComposeAnalyser, Jar, Parameterizer, DockerfileParser, DockerfileImageBuildScript, EarRouter, Gradle,     Kubernetes, WarRouter, ZuulAnalyser, CloudFoundry, Ruby-Dockerfile, ClusterSelector
    ? Select all services that are needed:
    Hints:
    [The services unselected here will be ignored.]
     customers-tomcat, frontend, gateway, inventory, orders
    INFO[0003] Starting Plan Transformation                 
    INFO[0003] Iteration 1                                  
    INFO[0003] Iteration 2 - 5 artifacts to process         
    INFO[0003] Transformer Maven processing 2 artifacts     
    ? Choose the Maven profile to be used for the service inventory
    Hints:
    [Selected Maven profiles will be used for setting configuration for the service inventory]
     local
    ? Select port to be exposed for the service inventory :
    Hints:
    [Select Other if you want to expose the service inventory to some other port]
     8080
    INFO[0005] Transformer WarRouter processing 2 artifacts 
    ? Select the transformer to use for service customers-tomcat
     Tomcat
    INFO[0007] Transformer WarRouter Done                   
    INFO[0007] Transformer Maven Done                       
    INFO[0007] Transformer CloudFoundry processing 3 artifacts 
    INFO[0007] Transformer ZuulAnalyser processing 2 artifacts 
    INFO[0007] Transformer ZuulAnalyser Done                
    INFO[0007] Transformer CloudFoundry Done                
    INFO[0007] Created 2 pathMappings and 8 artifacts. Total Path Mappings : 2. Total Artifacts : 5. 
    INFO[0007] Iteration 3 - 8 artifacts to process         
    INFO[0007] Transformer Jar processing 1 artifacts       
    INFO[0007] Transformer Jar Done                         
    INFO[0007] Transformer ClusterSelector processing 2 artifacts 
    ? Choose the cluster type:
    Hints:
    [Choose the cluster type you would like to target]
     Kubernetes
    INFO[0008] Transformer ClusterSelector Done             
    INFO[0008] Transformer Buildconfig processing 2 artifacts 
    ? What URL/path should we expose the service frontend's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /frontend
    ? What URL/path should we expose the service orders's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /orders
    ? What URL/path should we expose the service gateway's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /gateway
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
    INFO[0016] Transformer Buildconfig Done                 
    INFO[0016] Transformer Tomcat processing 2 artifacts    
    INFO[0016] Transformer Tomcat Done                      
    INFO[0016] Transformer Maven processing 2 artifacts     
    ? Choose the Maven profile to be used for the service gateway
    Hints:
    [Selected Maven profiles will be used for setting configuration for the service gateway]
     local
    ? Choose Springboot profiles to be used for the service gateway
    Hints:
    [Selected Springboot profiles will be used for setting configuration for the service gateway]
     local
    ? Select port to be exposed for the service gateway :
    Hints:
    [Select Other if you want to expose the service gateway to some other port]
     8080
    ? Choose the Maven profile to be used for the service orders
    Hints:
    [Selected Maven profiles will be used for setting configuration for the service orders]
     local
    ? Choose Springboot profiles to be used for the service orders
    Hints:
    [Selected Springboot profiles will be used for setting configuration for the service orders]
     local
    ? Select port to be exposed for the service orders :
    Hints:
    [Select Other if you want to expose the service orders to some other port]
     8080
    INFO[0026] Transformer Maven Done                       
    INFO[0026] Transformer ClusterSelector processing 2 artifacts 
    INFO[0026] Transformer ClusterSelector Done             
    INFO[0026] Transformer Kubernetes processing 2 artifacts 
    ? Provide the ingress host domain
    Hints:
    [Ingress host domain is part of service URL]
     localhost
    ? Provide the TLS secret for ingress
    Hints:
    [Leave empty to use http]
    
    INFO[0030] Transformer Kubernetes Done                  
    INFO[0030] Transformer ComposeGenerator processing 2 artifacts 
    INFO[0030] Transformer ComposeGenerator Done            
    INFO[0030] Transformer ClusterSelector processing 2 artifacts 
    INFO[0030] Transformer ClusterSelector Done             
    INFO[0030] Transformer Knative processing 2 artifacts   
    INFO[0030] Transformer Knative Done                     
    INFO[0030] Transformer Nodejs-Dockerfile processing 1 artifacts 
    ? Select port to be exposed for the service frontend :
    Hints:
    [Select Other if you want to expose the service frontend to some other port]
     8080
    INFO[0031] Transformer Nodejs-Dockerfile Done           
    INFO[0031] Transformer ClusterSelector processing 2 artifacts 
    INFO[0031] Transformer ClusterSelector Done             
    INFO[0031] Transformer Tekton processing 2 artifacts    
    INFO[0031] Transformer Tekton Done                      
    INFO[0032] Created 40 pathMappings and 16 artifacts. Total Path Mappings : 42. Total Artifacts : 13. 
    INFO[0032] Iteration 4 - 16 artifacts to process        
    INFO[0032] Transformer Parameterizer processing 4 artifacts 
    INFO[0032] Transformer Parameterizer Done               
    INFO[0032] Transformer Jar processing 2 artifacts       
    INFO[0032] Transformer Jar Done                         
    INFO[0032] Transformer DockerfileParser processing 4 artifacts 
    INFO[0032] Transformer ZuulAnalyser processing 2 artifacts 
    INFO[0032] Transformer ZuulAnalyser Done                
    INFO[0032] Transformer DockerfileParser Done            
    INFO[0032] Transformer DockerfileImageBuildScript processing 4 artifacts 
    ? Select the container runtime to use :
    Hints:
    [The container runtime selected will be used in the scripts]
     docker
    INFO[0033] Transformer DockerfileImageBuildScript Done  
    INFO[0033] Transformer ReadMeGenerator processing 4 artifacts 
    INFO[0033] Transformer ReadMeGenerator Done             
    INFO[0034] Created 18 pathMappings and 10 artifacts. Total Path Mappings : 60. Total Artifacts : 29. 
    INFO[0034] Iteration 5 - 10 artifacts to process        
    INFO[0034] Transformer ComposeGenerator processing 2 artifacts 
    ? What URL/path should we expose the service customers-tomcat's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /customers-tomcat
    ? What URL/path should we expose the service inventory's 8080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /inventory
    INFO[0036] Transformer ComposeGenerator Done            
    INFO[0036] Transformer ClusterSelector processing 2 artifacts 
    INFO[0036] Transformer ClusterSelector Done             
    INFO[0036] Transformer Knative processing 2 artifacts   
    INFO[0036] Transformer Knative Done                     
    INFO[0036] Transformer ClusterSelector processing 2 artifacts 
    INFO[0036] Transformer ClusterSelector Done             
    INFO[0036] Transformer Tekton processing 2 artifacts    
    INFO[0036] Transformer Tekton Done                      
    INFO[0036] Transformer ClusterSelector processing 2 artifacts 
    INFO[0036] Transformer ClusterSelector Done             
    INFO[0036] Transformer Buildconfig processing 2 artifacts 
    INFO[0036] Transformer Buildconfig Done                 
    INFO[0036] Transformer ContainerImagesPushScriptGenerator processing 2 artifacts 
    INFO[0036] Transformer ContainerImagesPushScriptGenerator Done 
    INFO[0036] Transformer DockerfileParser processing 2 artifacts 
    INFO[0037] Transformer ZuulAnalyser processing 2 artifacts 
    INFO[0037] Transformer ZuulAnalyser Done                
    INFO[0037] Transformer DockerfileParser Done            
    INFO[0037] Transformer DockerfileImageBuildScript processing 3 artifacts 
    INFO[0037] Transformer DockerfileImageBuildScript Done  
    INFO[0037] Transformer ClusterSelector processing 2 artifacts 
    INFO[0037] Transformer ClusterSelector Done             
    INFO[0037] Transformer Kubernetes processing 2 artifacts 
    INFO[0037] Transformer Kubernetes Done                  
    INFO[0037] Created 36 pathMappings and 15 artifacts. Total Path Mappings : 96. Total Artifacts : 39. 
    INFO[0037] Iteration 6 - 15 artifacts to process        
    INFO[0037] Transformer ComposeGenerator processing 2 artifacts 
    INFO[0037] Transformer ComposeGenerator Done            
    INFO[0037] Transformer ClusterSelector processing 2 artifacts 
    INFO[0037] Transformer ClusterSelector Done             
    INFO[0037] Transformer Knative processing 2 artifacts   
    INFO[0038] Transformer Knative Done                     
    INFO[0038] Transformer Parameterizer processing 4 artifacts 
    INFO[0038] Transformer Parameterizer Done               
    INFO[0038] Transformer ClusterSelector processing 2 artifacts 
    INFO[0038] Transformer ClusterSelector Done             
    INFO[0038] Transformer Tekton processing 2 artifacts    
    INFO[0038] Transformer Tekton Done                      
    INFO[0038] Transformer ClusterSelector processing 2 artifacts 
    INFO[0039] Transformer ClusterSelector Done             
    INFO[0039] Transformer Buildconfig processing 2 artifacts 
    INFO[0039] Transformer Buildconfig Done                 
    INFO[0039] Transformer ContainerImagesPushScriptGenerator processing 2 artifacts 
    INFO[0039] Transformer ContainerImagesPushScriptGenerator Done 
    INFO[0039] Transformer ClusterSelector processing 2 artifacts 
    INFO[0039] Transformer ClusterSelector Done             
    INFO[0039] Transformer Kubernetes processing 2 artifacts 
    INFO[0039] Transformer Kubernetes Done                  
    INFO[0039] Transformer ReadMeGenerator processing 5 artifacts 
    INFO[0039] Transformer ReadMeGenerator Done             
    INFO[0040] Created 48 pathMappings and 7 artifacts. Total Path Mappings : 144. Total Artifacts : 54. 
    INFO[0040] Iteration 7 - 7 artifacts to process         
    INFO[0040] Transformer ReadMeGenerator processing 5 artifacts 
    INFO[0040] Transformer ReadMeGenerator Done             
    INFO[0040] Transformer Parameterizer processing 4 artifacts 
    INFO[0040] Transformer Parameterizer Done               
    INFO[0040] Plan Transformation done                     
    INFO[0040] Transformed target artifacts can be found at [/Users/user/Desktop/tutorial/myproject]. 
    ```

## Transforming using the UI

1. Continuing from the previous step in the UI. Scrolling down from the plan section we see the `outputs` section. Click the `start transformation` button.

    ![No project inputs]({{ site.baseurl }}/assets/images/migration-workflow/15-no-project-outputs.png)

1. This brings up a modal to ask the user some questions to guide the transformation.

    ![QA 1]({{ site.baseurl }}/assets/images/migration-workflow/16-qa-1.jpeg)

1. Answer all the questions as appropriate. For most questions we can go with the default answers. Some questions to watch out for are:
    - An extra spurious service called `config-utils` was detected by one of the transformers. We can deselect it when we are asked to select the services we are interested in. Again, we could have done this by editing the plan file.
    - Move2Kube has detected the Maven profiles for each of the Java services. If you are deploying to MiniKube then select the `local` profile. Similar questions for the SpringBoot profiles.
    - The container registry and namespace that you want to use. A container registry is where all the images are stored (Example: Quay, Docker Hub, etc.)
    - The ingress hostname and ingress TLS secret. If you are deploying to MiniKube then give `localhost` as the ingress host and leave the TLS secret blank.

    ![QA 2]({{ site.baseurl }}/assets/images/migration-workflow/17-qa-2.jpg)
    ![QA 3]({{ site.baseurl }}/assets/images/migration-workflow/18-qa-3.jpg)
    ![QA 4]({{ site.baseurl }}/assets/images/migration-workflow/19-qa-4.jpg)
    ![QA 6]({{ site.baseurl }}/assets/images/migration-workflow/21-qa-6.jpg)
    ![QA 13]({{ site.baseurl }}/assets/images/migration-workflow/28-qa-13.jpg)
    ![QA 14]({{ site.baseurl }}/assets/images/migration-workflow/29-qa-14.jpg)
    ![QA 20]({{ site.baseurl }}/assets/images/migration-workflow/35-qa-20.jpg)
    ![QA 21]({{ site.baseurl }}/assets/images/migration-workflow/36-qa-21.jpg)
    ![QA 22]({{ site.baseurl }}/assets/images/migration-workflow/37-qa-22.jpg)

1. After you answer all the questions, wait a few minutes for it to stop processing. Now the output should appear. Click on it to download the output.

    ![New project output]({{ site.baseurl }}/assets/images/migration-workflow/41-new-project-output.jpg)
    ![Download the project output]({{ site.baseurl }}/assets/images/migration-workflow/42-download-project-output.jpg)
    ![Exploring the project output]({{ site.baseurl }}/assets/images/migration-workflow/43-explore-the-project-output.jpg)

## Using the output generated by Move2Kube transform

Now that we have generated the output we can run the scripts inside the `scripts` directory.
- The `builddockerimages.sh` script will build all the container images for each service using the Dockerfiles that were generated.

- The `pushimages.sh` script will push them to the container registry we specified.

- Finally we can deploy the Kubernetes yamls to our cluster using `kubectl apply -f deploy/yamls`

## Next steps

> Optional: [Collect information from running apps](/tutorials/migration-workflow/collect)

### Customizing the output

After inspecting the output that Move2Kube produced we might see some things we want to change. For example, we might want to change the base image used in the Dockerfiles, add some annotations to the Ingress YAML, maybe change the output directory structure, change which values are parameterized in the Helm chart, generate some new files, etc. For all these user specific requirements and more, we can write our own custom transformers.

Next step [Customizing the output](/tutorials/customizing-the-output)
