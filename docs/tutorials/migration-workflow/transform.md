---
layout: default
title: "Transform"
permalink: /tutorials/migration-workflow/transform
parent: "Migration workflow"
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

1. Answer all the questions as appropriate. For most questions we can go with the default answers. Some questions to watch out for are the ones about the container registry and namespace that you want to use. There's also a question that lets you change the ingress hostname and ingress TLS secret. There's also an extra spurious service that was detected called `config-utils`, we can turn that off when we are asked to select the services we are interested in. We can also select `local` for the Maven profiles to use for each service.

    ```console
    $ move2kube transform
    INFO[0000] Detected a plan file at path /Users/user/Desktop/tutorial/m2k.plan. Will transform using this plan. 
    ? Select all transformer types that you are interested in:
    Hints:
    [Services that don't support any of the transformer types you are interested in will be ignored.]
     ComposeGenerator, Nodejs-Dockerfile, WarAnalyser, WinConsoleApp-Dockerfile, ClusterSelector, Golang-Dockerfile, Jar, Rust-Dockerfile, Tomcat, CloudFoundry, Gradle, Liberty,   Maven, ZuulAnalyser, Buildconfig, Jboss, KubernetesVersionChanger, Parameterizer, ReadMeGenerator, Python-Dockerfile, WinWebApp-Dockerfile,   ContainerImagesPushScriptGenerator, DockerfileImageBuildScript, EarAnalyser, EarRouter, PHP-Dockerfile, DockerfileParser, Knative, Ruby-Dockerfile, Tekton, ComposeAnalyser,  WinSLWebApp-Dockerfile, DockerfileDetector, DotNetCore-Dockerfile, Kubernetes, WarRouter
    ? Select all services that are needed:
    Hints:
    [The services unselected here will be ignored.]
     customers-tomcat, frontend, gateway, inventory, orders
    INFO[0207] Starting Plan Transformation                 
    INFO[0207] Iteration 1                                  
    INFO[0207] Iteration 2 - 5 artifacts to process         
    INFO[0207] Transformer Maven processing 2 artifacts     
    ? Choose the Maven profile to be used for the service Maven
    Hints:
    [Selected Maven profiles will be used for setting configuration for the service Maven]
     local
    ? Select port to be exposed for the service Maven :
    Hints:
    [Select Other if you want to expose the service Maven to some other port]
     8080
    INFO[0250] Transformer Maven Done                       
    INFO[0250] Transformer CloudFoundry processing 3 artifacts 
    INFO[0250] Transformer ZuulAnalyser processing 2 artifacts 
    INFO[0250] Transformer ZuulAnalyser Done                
    INFO[0250] Transformer CloudFoundry Done                
    INFO[0250] Created 2 pathMappings and 7 artifacts. Total Path Mappings : 2. Total Artifacts : 5. 
    INFO[0250] Iteration 3 - 7 artifacts to process         
    INFO[0250] Transformer Liberty processing 1 artifacts   
    INFO[0250] Transformer Liberty Done                     
    INFO[0250] Transformer ClusterSelector processing 2 artifacts 
    ? Choose the cluster type:
    Hints:
    [Choose the cluster type you would like to target]
     Kubernetes
    INFO[0259] Transformer ClusterSelector Done             
    INFO[0259] Transformer Knative processing 2 artifacts   
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
    INFO[0289] Transformer Knative Done                     
    INFO[0289] Transformer ClusterSelector processing 2 artifacts 
    INFO[0289] Transformer ClusterSelector Done             
    INFO[0289] Transformer Tekton processing 2 artifacts    
    ? Provide the ingress host domain
    Hints:
    [Ingress host domain is part of service URL]
     localhost
    ? Provide the TLS secret for ingress
    Hints:
    [Leave empty to use http]
    
    INFO[0307] Transformer Tekton Done                      
    INFO[0307] Transformer ClusterSelector processing 2 artifacts 
    INFO[0307] Transformer ClusterSelector Done             
    INFO[0307] Transformer Kubernetes processing 2 artifacts 
    INFO[0307] Transformer Kubernetes Done                  
    INFO[0307] Transformer ComposeGenerator processing 2 artifacts 
    INFO[0307] Transformer ComposeGenerator Done            
    INFO[0307] Transformer Tomcat processing 1 artifacts    
    INFO[0307] Transformer Tomcat Done                      
    INFO[0307] Transformer Jar processing 1 artifacts       
    INFO[0307] Transformer Jar Done                         
    INFO[0307] Transformer Jboss processing 1 artifacts     
    INFO[0307] Transformer Jboss Done                       
    INFO[0307] Transformer ClusterSelector processing 2 artifacts 
    INFO[0307] Transformer ClusterSelector Done             
    INFO[0307] Transformer Buildconfig processing 2 artifacts 
    INFO[0307] Transformer Buildconfig Done                 
    INFO[0307] Transformer WarRouter processing 2 artifacts 
    ? Select the transformer to use for service Maven
     Jboss
    INFO[0342] Transformer WarRouter Done                   
    INFO[0342] Created 38 pathMappings and 16 artifacts. Total Path Mappings : 40. Total Artifacts : 12. 
    INFO[0342] Iteration 4 - 16 artifacts to process        
    INFO[0342] Transformer ReadMeGenerator processing 4 artifacts 
    INFO[0342] Transformer ReadMeGenerator Done             
    INFO[0342] Transformer Jboss processing 2 artifacts     
    INFO[0342] Transformer Jboss Done                       
    INFO[0342] Transformer Parameterizer processing 4 artifacts 
    INFO[0342] Transformer Parameterizer Done               
    INFO[0342] Transformer DockerfileParser processing 4 artifacts 
    INFO[0343] Transformer ZuulAnalyser processing 2 artifacts 
    INFO[0343] Transformer ZuulAnalyser Done                
    INFO[0343] Transformer DockerfileParser Done            
    INFO[0343] Transformer DockerfileImageBuildScript processing 2 artifacts 
    ? Select the container runtime to use :
    Hints:
    [The container runtime selected will be used in the scripts]
     docker
    INFO[0352] Transformer DockerfileImageBuildScript Done  
    INFO[0353] Created 18 pathMappings and 9 artifacts. Total Path Mappings : 58. Total Artifacts : 28. 
    INFO[0353] Iteration 5 - 9 artifacts to process         
    INFO[0353] Transformer ClusterSelector processing 2 artifacts 
    INFO[0353] Transformer ClusterSelector Done             
    INFO[0353] Transformer Buildconfig processing 2 artifacts 
    ? What URL/path should we expose the service customers-tomcat's 9080 port on?
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer service type]
     /customers-tomcat
    INFO[0368] Transformer Buildconfig Done                 
    INFO[0368] Transformer DockerfileParser processing 2 artifacts 
    INFO[0369] Transformer ZuulAnalyser processing 2 artifacts 
    INFO[0369] Transformer ZuulAnalyser Done                
    INFO[0369] Transformer DockerfileParser Done            
    INFO[0369] Transformer ContainerImagesPushScriptGenerator processing 2 artifacts 
    INFO[0369] Transformer ContainerImagesPushScriptGenerator Done 
    INFO[0369] Transformer DockerfileImageBuildScript processing 2 artifacts 
    INFO[0369] Transformer DockerfileImageBuildScript Done  
    INFO[0369] Transformer ClusterSelector processing 2 artifacts 
    INFO[0369] Transformer ClusterSelector Done             
    INFO[0369] Transformer Knative processing 2 artifacts   
    INFO[0369] Transformer Knative Done                     
    INFO[0369] Transformer ClusterSelector processing 2 artifacts 
    INFO[0369] Transformer ClusterSelector Done             
    INFO[0369] Transformer Tekton processing 2 artifacts    
    INFO[0369] Transformer Tekton Done                      
    INFO[0369] Transformer ClusterSelector processing 2 artifacts 
    INFO[0369] Transformer ClusterSelector Done             
    INFO[0369] Transformer Kubernetes processing 2 artifacts 
    INFO[0370] Transformer Kubernetes Done                  
    INFO[0370] Transformer ComposeGenerator processing 2 artifacts 
    INFO[0370] Transformer ComposeGenerator Done            
    INFO[0370] Created 34 pathMappings and 12 artifacts. Total Path Mappings : 92. Total Artifacts : 37. 
    INFO[0370] Iteration 6 - 12 artifacts to process        
    INFO[0370] Transformer ContainerImagesPushScriptGenerator processing 2 artifacts 
    INFO[0370] Transformer ContainerImagesPushScriptGenerator Done 
    INFO[0370] Transformer ReadMeGenerator processing 5 artifacts 
    INFO[0370] Transformer ReadMeGenerator Done             
    INFO[0370] Transformer ClusterSelector processing 2 artifacts 
    INFO[0370] Transformer ClusterSelector Done             
    INFO[0370] Transformer Knative processing 2 artifacts   
    INFO[0370] Transformer Knative Done                     
    INFO[0370] Transformer ClusterSelector processing 2 artifacts 
    INFO[0370] Transformer ClusterSelector Done             
    INFO[0370] Transformer Tekton processing 2 artifacts    
    INFO[0371] Transformer Tekton Done                      
    INFO[0371] Transformer ClusterSelector processing 2 artifacts 
    INFO[0371] Transformer ClusterSelector Done             
    INFO[0371] Transformer Kubernetes processing 2 artifacts 
    INFO[0371] Transformer Kubernetes Done                  
    INFO[0371] Transformer ComposeGenerator processing 2 artifacts 
    INFO[0371] Transformer ComposeGenerator Done            
    INFO[0371] Transformer ClusterSelector processing 2 artifacts 
    INFO[0371] Transformer ClusterSelector Done             
    INFO[0371] Transformer Buildconfig processing 2 artifacts 
    INFO[0371] Transformer Buildconfig Done                 
    INFO[0371] Transformer Parameterizer processing 4 artifacts 
    INFO[0372] Transformer Parameterizer Done               
    INFO[0372] Created 46 pathMappings and 7 artifacts. Total Path Mappings : 138. Total Artifacts : 49. 
    INFO[0372] Iteration 7 - 7 artifacts to process         
    INFO[0372] Transformer ReadMeGenerator processing 5 artifacts 
    INFO[0372] Transformer ReadMeGenerator Done             
    INFO[0372] Transformer Parameterizer processing 4 artifacts 
    INFO[0372] Transformer Parameterizer Done               
    INFO[0372] Plan Transformation done                     
    INFO[0372] Transformed target artifacts can be found at [/Users/user/Desktop/tutorial/myproject]. 
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

Now that we have generated the output we can run the scripts inside the `scripts` directory.
- The `buildimages.sh` script will build all the container images for each service using the Dockerfiles that were generated.

- The `pushimages.sh` script will push them to the container registry we specified.

- Finally we can deploy the Kubernetes yamls to our cluster using `kubectl apply -f deploy/yamls`

## Next steps

> Optional: [Collect information from running apps](/tutorials/migration-workflow/collect)

### Customizing the output

After inspecting the output that Move2Kube produced we might see some things we want to change. For example, we might want to change the base image used in the Dockerfiles, add some annotations to the Ingress YAML, maybe change the output directory structure, change which values are parameterized in the Helm chart, generate some new files, etc. For all these user specific requirements and more, we can write our own custom transformers.

Next step [Custom transformer for changing base image](/tutorials/migration-workflow/base-image-change)
