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

If you want to skip the QA, you can use the `--qa-skip` flag to accept default answers. However rather than skipping the questions, you can give a config file that contains all of the answers using the `--config` flag.

After the transformation is finished, all the answers are written to a config file called `m2kconfig.yaml`. This can be used for later transformations.

The transformation phase produces all the output files we need including, the Dockerfiles, build scripts for containerizing  various services and Kubernetes Deployment, Service and Ingress YAMLs necessary for deploying our application to a Kubernetes cluster.

In addition Move2Kube also generates the CI/CD pipeline and parameterized versions of all those Kubernetes YAMLs (Helm chart, Kustomize YAMLs, Openshift templates, etc.) for various environments (dev, staging, prod, etc.).

## Prerequisites

1. Finish the previous [Plan](/tutorials/migration-workflow/plan) step before following the steps below.

## Transforming using the CLI

1. Run the transformation in the same directory as the plan file. This will detect the plan file and use it to find the source directory.
    ```
    $ move2kube transform
    ```

    <details markdown="block">
    <summary markdown="block">
        Optional: Provide answers to questions using a config file...
    </summary>
    If you want to avoid the question answers during transformation, you can use this [config file](https://github.com/konveyor/move2kube-demos/blob/main/samples/enterprise-app/config/m2kconfig.yaml)
    ```
    $ move2kube transform --config m2kconfig.yaml
    ```
    </details>

1. Answer all the questions as appropriate. For most questions we can go with the default answers. Some questions to watch out for are:
    - A spurious service called `config-utils` was detected by one of the transformers. We can deselect it when we are asked to select the services we are interested in. We could also do this by editing the plan file.
    - Move2Kube has detected the Maven profiles for each of the Java services. If you are deploying to MiniKube then select the `dev-inmemorydb` profile. Similar questions for the SpringBoot profiles.
    - The container registry and namespace that you want to use. A container registry is where all the images are stored (Example: Quay, Docker Hub, etc.)
    - The ingress hostname and ingress TLS secret. If you are deploying to MiniKube then give `localhost` as the ingress host and leave the TLS secret blank.

    <details markdown="block">
    <summary markdown="block">
    ```console
    # click to see the output
    $ move2kube transform
    ```
    </summary>
    ```console
    INFO[0000] Detected a plan file at path /Users/user/Desktop/tutorial/m2k.plan. Will transform using this plan. 
    INFO[0000] Starting Plan Transformation                 
    ? Select all transformer types that you are interested in:
    ID: move2kube.transformers.types
    Hints:
    [Services that don't support any of the transformer types you are interested in will be ignored.]
     Buildconfig, CloudFoundry, ClusterSelector, ComposeAnalyser, ComposeGenerator, ContainerImagesPushScriptGenerator, DockerfileDetector,     DockerfileImageBuildScript, DockerfileParser, DotNetCore-Dockerfile, EarAnalyser, EarRouter, Golang-Dockerfile, Gradle, Jar, Jboss, Knative, Kubernetes,    KubernetesVersionChanger, Liberty, Maven, Nodejs-Dockerfile, PHP-Dockerfile, Parameterizer, Python-Dockerfile, ReadMeGenerator, Ruby-Dockerfile,   Rust-Dockerfile, Tekton, Tomcat, WarAnalyser, WarRouter, WinConsoleApp-Dockerfile, WinSLWebApp-Dockerfile, WinWebApp-Dockerfile, ZuulAnalyser
    ? Select all services that are needed:
    ID: move2kube.services.[].enable
    Hints:
    [The services unselected here will be ignored.]
     customers, frontend, gateway, inventory, orders
    INFO[0002] Iteration 1                                  
    INFO[0002] Iteration 2 - 5 artifacts to process         
    INFO[0002] Transformer CloudFoundry processing 3 artifacts 
    INFO[0002] Transformer CloudFoundry Done                
    INFO[0002] Transformer Maven processing 2 artifacts     
    ? Choose the Maven profile to be used for the service customers
    ID: move2kube.services.customers.activemavenprofiles
    Hints:
    [Selected Maven profiles will be used for setting configuration for the service customers]
     dev-inmemorydb
    ? Choose Springboot profiles to be used for the service customers
    ID: move2kube.services.customers.activespringbootprofiles
    Hints:
    [Selected Springboot profiles will be used for setting configuration for the service customers]
     dev-inmemorydb
    ? Choose the Maven profile to be used for the service inventory
    ID: move2kube.services.inventory.activemavenprofiles
    Hints:
    [Selected Maven profiles will be used for setting configuration for the service inventory]
     dev-inmemorydb
    ? Choose Springboot profiles to be used for the service inventory
    ID: move2kube.services.inventory.activespringbootprofiles
    Hints:
    [Selected Springboot profiles will be used for setting configuration for the service inventory]
     dev-inmemorydb
    ? Select port to be exposed for the service inventory :
    ID: move2kube.services.inventory.port
    Hints:
    [Select Other if you want to expose the service inventory to some other port]
     Other (specify custom option)
    ? Input Select port to be exposed for the service inventory :
    ID: move2kube.services.inventory.port
     8083
    INFO[0273] Transformer WarRouter processing 2 artifacts 
    ? Select the transformer to use for service customers
    ID: move2kube.services.customers.wartransformer
     Tomcat
    INFO[0275] Transformer WarRouter Done                   
    INFO[0275] Transformer Maven Done                       
    INFO[0275] Created 2 pathMappings and 6 artifacts. Total Path Mappings : 2. Total Artifacts : 5. 
    INFO[0275] Iteration 3 - 6 artifacts to process         
    INFO[0275] Transformer Jar processing 1 artifacts       
    INFO[0275] Transformer Jar Done                         
    INFO[0275] Transformer Maven processing 2 artifacts     
    ? Choose the Maven profile to be used for the service gateway
    ID: move2kube.services.gateway.activemavenprofiles
    Hints:
    [Selected Maven profiles will be used for setting configuration for the service gateway]
     dev
    ? Choose Springboot profiles to be used for the service gateway
    ID: move2kube.services.gateway.activespringbootprofiles
    Hints:
    [Selected Springboot profiles will be used for setting configuration for the service gateway]
     dev
    ? Select port to be exposed for the service gateway :
    ID: move2kube.services.gateway.port
    Hints:
    [Select Other if you want to expose the service gateway to some other port]
     8080
    ? Choose the Maven profile to be used for the service orders
    ID: move2kube.services.orders.activemavenprofiles
    Hints:
    [Selected Maven profiles will be used for setting configuration for the service orders]
     dev-inmemorydb
    ? Choose Springboot profiles to be used for the service orders
    ID: move2kube.services.orders.activespringbootprofiles
    Hints:
    [Selected Springboot profiles will be used for setting configuration for the service orders]
     dev-inmemorydb
    ? Select port to be exposed for the service orders :
    ID: move2kube.services.orders.port
    Hints:
    [Select Other if you want to expose the service orders to some other port]
     Other (specify custom option)
    ? Input Select port to be exposed for the service orders :
    ID: move2kube.services.orders.port
     8081
    INFO[0337] Transformer Maven Done                       
    INFO[0337] Transformer Nodejs-Dockerfile processing 1 artifacts 
    ? Enter the port to be exposed for the service frontend: 
    ID: move2kube.services.frontend.port
    Hints:
    [The service frontend will be exposed to the specified port]
     8080
    INFO[0369] Transformer Nodejs-Dockerfile Done           
    INFO[0369] Transformer Tomcat processing 2 artifacts    
    INFO[0369] Transformer Tomcat Done                      
    INFO[0370] Created 10 pathMappings and 10 artifacts. Total Path Mappings : 12. Total Artifacts : 11. 
    INFO[0370] Iteration 4 - 10 artifacts to process        
    INFO[0370] Transformer DockerfileImageBuildScript processing 4 artifacts 
    ? Select the container runtime to use :
    ID: move2kube.containerruntime
    Hints:
    [The container runtime selected will be used in the scripts]
     docker
    INFO[0372] Transformer DockerfileImageBuildScript Done  
    INFO[0372] Transformer DockerfileParser processing 4 artifacts 
    INFO[0372] Transformer ZuulAnalyser processing 2 artifacts 
    INFO[0372] Transformer ZuulAnalyser Done                
    INFO[0372] Transformer DockerfileParser Done            
    INFO[0372] Transformer Jar processing 2 artifacts       
    INFO[0372] Transformer Jar Done                         
    INFO[0372] Created 5 pathMappings and 10 artifacts. Total Path Mappings : 17. Total Artifacts : 21. 
    INFO[0372] Iteration 5 - 10 artifacts to process        
    INFO[0372] Transformer ClusterSelector processing 2 artifacts 
    ? Choose the cluster type:
    ID: move2kube.target.clustertype
    Hints:
    [Choose the cluster type you would like to target]
     Kubernetes
    INFO[0375] Transformer ClusterSelector Done             
    INFO[0375] Transformer Buildconfig processing 2 artifacts 
    ? What URL/path should we expose the service inventory's 8083 port on?
    ID: move2kube.services."inventory"."8083".urlpath
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer  service type]
     :-
    ? What URL/path should we expose the service customers's 8080 port on?
    ID: move2kube.services."customers"."8080".urlpath
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer  service type]
     :-
    ? What URL/path should we expose the service frontend's 8080 port on?
    ID: move2kube.services."frontend"."8080".urlpath
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer  service type]
     /
    ? Provide the minimum number of replicas each service should have
    ID: move2kube.minreplicas
    Hints:
    [If the value is 0 pods won't be started by default]
     2
    ? Enter the URL of the image registry : 
    ID: move2kube.target.imageregistry.url
    Hints:
    [You can always change it later by changing the yamls.]
     quay.io
    ? Enter the namespace where the new images should be pushed : 
    ID: move2kube.target.imageregistry.namespace
    Hints:
    [Ex : myproject]
     move2kube
    ? [quay.io] What type of container registry login do you want to use?
    ID: move2kube.target.imageregistry.logintype
    Hints:
    [Docker login from config mode, will use the default config from your local machine.]
     No authentication
    INFO[0387] Transformer Buildconfig Done                 
    INFO[0387] Transformer ComposeGenerator processing 2 artifacts 
    INFO[0388] Transformer ComposeGenerator Done            
    INFO[0388] Transformer ContainerImagesPushScriptGenerator processing 2 artifacts 
    INFO[0388] Transformer ContainerImagesPushScriptGenerator Done 
    INFO[0388] Transformer DockerfileImageBuildScript processing 3 artifacts 
    INFO[0388] Transformer DockerfileImageBuildScript Done  
    INFO[0388] Transformer DockerfileParser processing 2 artifacts 
    INFO[0388] Transformer ZuulAnalyser processing 2 artifacts 
    INFO[0388] Transformer ZuulAnalyser Done                
    INFO[0388] Transformer DockerfileParser Done            
    INFO[0388] Transformer ClusterSelector processing 2 artifacts 
    INFO[0388] Transformer ClusterSelector Done             
    INFO[0388] Transformer Knative processing 2 artifacts   
    INFO[0388] Transformer Knative Done                     
    INFO[0388] Transformer ClusterSelector processing 2 artifacts 
    INFO[0388] Transformer ClusterSelector Done             
    INFO[0388] Transformer Kubernetes processing 2 artifacts 
    ? Provide the ingress host domain
    ID: move2kube.target.ingress.host
    Hints:
    [Ingress host domain is part of service URL]
     localhost
    ? Provide the TLS secret for ingress
    ID: move2kube.target.ingress.tls
    Hints:
    [Leave empty to use http]
    
    INFO[0414] Transformer Kubernetes Done                  
    INFO[0414] Transformer ClusterSelector processing 2 artifacts 
    INFO[0414] Transformer ClusterSelector Done             
    INFO[0414] Transformer Tekton processing 2 artifacts    
    INFO[0414] Transformer Tekton Done                      
    INFO[0414] Created 34 pathMappings and 15 artifacts. Total Path Mappings : 51. Total Artifacts : 31. 
    INFO[0414] Iteration 6 - 15 artifacts to process        
    INFO[0414] Transformer ClusterSelector processing 2 artifacts 
    INFO[0414] Transformer ClusterSelector Done             
    INFO[0414] Transformer Buildconfig processing 2 artifacts 
    ? What URL/path should we expose the service gateway's 8080 port on?
    ID: move2kube.services."gateway"."8080".urlpath
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer  service type]
     :-
    ? What URL/path should we expose the service orders's 8081 port on?
    ID: move2kube.services."orders"."8081".urlpath
    Hints:
    [Enter :- not expose the service, Leave out leading / to use first part as subdomain, Add :N as suffix for NodePort service type, Add :L for Load Balancer  service type]
     :-
    INFO[0418] Transformer Buildconfig Done                 
    INFO[0418] Transformer ComposeGenerator processing 2 artifacts 
    INFO[0419] Transformer ComposeGenerator Done            
    INFO[0419] Transformer ContainerImagesPushScriptGenerator processing 2 artifacts 
    INFO[0419] Transformer ContainerImagesPushScriptGenerator Done 
    INFO[0419] Transformer ClusterSelector processing 2 artifacts 
    INFO[0419] Transformer ClusterSelector Done             
    INFO[0419] Transformer Knative processing 2 artifacts   
    INFO[0419] Transformer Knative Done                     
    INFO[0419] Transformer ClusterSelector processing 2 artifacts 
    INFO[0419] Transformer ClusterSelector Done             
    INFO[0419] Transformer Kubernetes processing 2 artifacts 
    INFO[0419] Transformer Kubernetes Done                  
    INFO[0419] Transformer Parameterizer processing 4 artifacts 
    INFO[0419] Transformer Parameterizer Done               
    INFO[0419] Transformer ReadMeGenerator processing 5 artifacts 
    INFO[0419] Transformer ReadMeGenerator Done             
    INFO[0419] Transformer ClusterSelector processing 2 artifacts 
    INFO[0420] Transformer ClusterSelector Done             
    INFO[0420] Transformer Tekton processing 2 artifacts    
    INFO[0420] Transformer Tekton Done                      
    INFO[0420] Created 54 pathMappings and 7 artifacts. Total Path Mappings : 105. Total Artifacts : 46. 
    INFO[0420] Iteration 7 - 7 artifacts to process         
    INFO[0420] Transformer Parameterizer processing 4 artifacts 
    INFO[0420] Transformer Parameterizer Done               
    INFO[0420] Transformer ReadMeGenerator processing 5 artifacts 
    INFO[0421] Transformer ReadMeGenerator Done             
    INFO[0421] Plan Transformation done                     
    INFO[0421] Transformed target artifacts can be found at [/Users/user/temp/t2/myproject]. 
    ```
    </details>

## Transforming using the UI

1. Continuing from the previous step in the UI. Scrolling down from the plan section we see the `outputs` section. Click the `start transformation` button.

    ![No project inputs]({{ site.baseurl }}/assets/images/migration-workflow/15-no-project-outputs.png)

1. This brings up a modal to ask the user some questions to guide the transformation.

    ![QA 1]({{ site.baseurl }}/assets/images/migration-workflow/16-qa-1.jpeg)

1. Answer all the questions as appropriate. For most questions we can go with the default answers. Some questions to watch out for are:
    - A spurious service called `config-utils` was detected by one of the transformers. We can deselect it when we are asked to select the services we are interested in. Again, we could have done this by editing the plan file.
    - Move2Kube has detected the Maven profiles for each of the Java services. If you are deploying to MiniKube then select the `dev-inmemorydb` profile. Similar questions for the SpringBoot profiles.
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

> Optionally, As part of the above transformation if runtime information of the cloud foundry app is required, you can use the collect output in planning and transformation : [Collect information from running apps](/tutorials/migration-workflow/collect)

### Customizing the output

After inspecting the output that Move2Kube produced we might see some things we want to change. For example, we might want to change the base image used in the Dockerfiles, add some annotations to the Ingress YAML, maybe change the output directory structure, change which values are parameterized in the Helm chart, generate some new files, etc. For all these user specific requirements and more, we can use customizations.

Next step [Customizing the output](/tutorials/customizing-the-output)
