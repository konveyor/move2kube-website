---
layout: default
title: "Plan"
permalink: /tutorials/migration-workflow/plan
parent: "Migration workflow"
grand_parent: Tutorials
nav_order: 2
---

# Plan

Now that we have collected the information about our Cloud Foundry app using `collect` we can start planning.

As mentioned before the `collect` step is optional. You can directly start with the planning phase if you don't want to collect runtime information about your app.
The steps to follow remain largely the same.

During the plan phase Move2Kube will analyze the files in the source directory, detect what services exist and come up with a plan on how to containerize them using Dockerfiles and transform them into Kubernetes Deployments, Services, Ingress, etc.

In order to do the planning Move2Kube has a large number of built-in transformers for various different languages and platforms. Each transformer walks through the source directory from top to bottom and tries to find files that it recognizes. For example, a Golang transformer might try to find `go.mod` file to detect a Golang project. Once it detects a directory containing a service, it will try to extract as much information from it as possible. Some of the information it tries to find is the service name, ports, environment variables, etc.

This information is stored in YAML format in a plan file called `m2k.plan`. This file is used later during the transformation phase. We can also edit this file to enable/disable transformers, add/remove detected services, etc.

## Prerequisites

We are still using the same [e2e-demo](https://github.com/konveyor/move2kube-demos/tree/dda15a4c8bd7a750d0e57bd31dd926fd135c4a3c/samples/enterprise-app) app from the previous steps. If you don't have it, you can download the 2 zip files:
    - [The source code](https://github.com/konveyor/move2kube-demos/blob/dda15a4c8bd7a750d0e57bd31dd926fd135c4a3c/samples/enterprise-app/src.zip)
    - [The information collected from Cloud Foundry](https://github.com/konveyor/move2kube-demos/blob/main/samples/enterprise-app/collect/cf.zip)

    ```console
    $ curl -Lo src.zip 'https://github.com/konveyor/move2kube-demos/blob/main/samples/enterprise-app/src.zip?raw=true'
    % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                    Dload  Upload   Total   Spent    Left  Speed
    100   149  100   149    0     0    295      0 --:--:-- --:--:-- --:--:--   300
    100   160  100   160    0     0    175      0 --:--:-- --:--:-- --:--:--  156k
    100  603k  100  603k    0     0   261k      0  0:00:02  0:00:02 --:--:-- 4825k
    $ unzip src.zip 
    $ curl -Lo cf.zip 'https://github.com/konveyor/move2kube-demos/blob/main/samples/enterprise-app/collect/cf.zip?raw=true'
    % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                    Dload  Upload   Total   Spent    Left  Speed
    100   156  100   156    0     0    329      0 --:--:-- --:--:-- --:--:--   334
    100   167  100   167    0     0    217      0 --:--:-- --:--:-- --:--:--  163k
    100  1836  100  1836    0     0   1440      0  0:00:01  0:00:01 --:--:--  1440
    $ unzip cf.zip 
    Archive:  cf.zip
    creating: cf/
    inflating: cf/cfapps.yaml          
    $ ls
    cf		cf.zip		src		src.zip
    $ ls src
    README.md		config-utils		customers-tomcat-k8s	customers-tomcat-legacy	docs			frontend		gateway			inventory		orders
    $ ls cf
    cfapps.yaml

    # rearrange everything for the sake of matching the output of the previous step

    $ mkdir m2k_collect
    $ mv cf m2k_collect/
    $ ls
    cf.zip		m2k_collect	src		src.zip
    $ ls m2k_collect/
    cf
    ```

## Planning using the CLI

1. Move the collected Cloud Foundry information into the source directory
    ```console
    $ mv m2k_collect/cf/ src
    $ ls src
    README.md		cf			config-utils		customers-tomcat-k8s	customers-tomcat-legacy	docs			frontend		gateway			inventory		orders
    ```

1. Run `move2kube plan -s src` to generate a plan on how to migrate our app to Kubernetes.

    ```console
    $ move2kube plan -s src
    INFO[0000] Configuration loading done                   
    INFO[0000] Planning Transformation - Base Directory     
    INFO[0000] [CloudFoundry] Planning transformation       
    INFO[0000] Identified 3 named services and 0 to-be-named services 
    INFO[0000] [CloudFoundry] Done                          
    INFO[0000] [ComposeAnalyser] Planning transformation    
    INFO[0000] [ComposeAnalyser] Done                       
    INFO[0000] [ZuulAnalyser] Planning transformation       
    INFO[0000] [ZuulAnalyser] Done                          
    INFO[0000] [DockerfileDetector] Planning transformation 
    INFO[0000] Identified 1 named services and 1 to-be-named services 
    INFO[0000] [DockerfileDetector] Done                    
    INFO[0000] [Base Directory] Identified 4 named services and 1 to-be-named services 
    INFO[0000] Transformation planning - Base Directory done 
    INFO[0000] Planning Transformation - Directory Walk     
    INFO[0000] Identified 1 named services and 0 to-be-named services in config-utils 
    INFO[0000] Identified 1 named services and 0 to-be-named services in customers-tomcat-k8s 
    INFO[0000] Identified 1 named services and 0 to-be-named services in customers-tomcat-legacy 
    INFO[0000] Identified 1 named services and 0 to-be-named services in frontend 
    INFO[0000] Identified 1 named services and 0 to-be-named services in gateway 
    INFO[0000] Identified 1 named services and 0 to-be-named services in inventory 
    INFO[0000] Identified 1 named services and 0 to-be-named services in orders 
    INFO[0000] Transformation planning - Directory Walk done 
    INFO[0000] [Directory Walk] Identified 7 named services and 1 to-be-named services 
    INFO[0000] [Named Services] Identified 6 named services 
    INFO[0000] No of services identified : 6                
    INFO[0000] Plan can be found at [/Users/user/Desktop/demo2/m2k.plan]. 
    ```

1. Let's look at the plan file that was generated.

    ```console
    $ cat m2k.plan 
    ```

    ```yaml
    apiVersion: move2kube.konveyor.io/v1alpha1
    kind: Plan
    metadata:
      name: myproject
    spec:
      rootDir: src
      services:
        config-utils:
          - type: Maven
            paths:
              MavenPom:
                - config-utils/pom.xml
              ProjectPath:
                - config-utils
            configs:
              Maven:
                mavenAppName: config-utils
                artifactType: jar
        customers-tomcat:
          - type: Maven
            paths:
              MavenPom:
                - customers-tomcat-k8s/pom.xml
              ProjectPath:
                - customers-tomcat-k8s
            configs:
              Maven:
                mavenAppName: customers-tomcat
                artifactType: war
              SpringBoot:
                springBootVersion: 2.5.0
          - type: Maven
            paths:
              MavenPom:
                - customers-tomcat-legacy/pom.xml
              ProjectPath:
                - customers-tomcat-legacy
            configs:
              Maven:
                mavenAppName: customers-tomcat
                artifactType: war
              SpringBoot:
                springBootVersion: 2.5.0
        frontend:
          - type: CloudFoundry
            paths:
              CfManifest:
                - frontend/manifest.yml
              ProjectPath:
                - frontend
            configs:
              CloudFoundryService:
                serviceName: frontend
              ContainerizationOptions:
                - Nodejs-Dockerfile
          - type: Nodejs-Dockerfile
            paths:
              ProjectPath:
                - frontend
        gateway:
          - type: CloudFoundry
            paths:
              BuildArtifact:
                - gateway/target/gateway-2.0.0-SNAPSHOT-exec.jar
              CfManifest:
                - gateway/manifest.yml
              ProjectPath:
                - gateway
            configs:
              CloudFoundryService:
                serviceName: gateway
              ContainerizationOptions:
                - Maven
          - type: Maven
            paths:
              MavenPom:
                - gateway/pom.xml
              ProjectPath:
                - gateway
            configs:
              Maven:
                mavenAppName: gateway
                artifactType: jar
                mavenProfiles:
                  - local
                  - openshift
                  - openshift-manual
                  - openshift-it
              SpringBoot:
                springBootAppName: gateway
                springBootProfiles:
                  - local
                  - openshift
        inventory:
          - type: Maven
            paths:
              MavenPom:
                - inventory/pom.xml
              ProjectPath:
                - inventory
            configs:
              Maven:
                mavenAppName: inventory
                artifactType: jar
                mavenProfiles:
                  - native
                  - local
                  - openshift
          - type: DockerfileDetector
            paths:
              Dockerfile:
                - inventory/src/main/docker/Dockerfile.jvm
              ProjectPath:
                - inventory/src/main/docker
          - type: DockerfileDetector
            paths:
              Dockerfile:
                - inventory/src/main/docker/Dockerfile.native
              ProjectPath:
                - inventory/src/main/docker
        orders:
          - type: CloudFoundry
            paths:
              BuildArtifact:
                - orders/target/orders-2.0.0-SNAPSHOT-exec.jar
              CfManifest:
                - orders/manifest.yml
              ProjectPath:
                - orders
            configs:
              CloudFoundryService:
                serviceName: orders
              ContainerizationOptions:
                - Maven
          - type: Maven
            paths:
              MavenPom:
                - orders/pom.xml
              ProjectPath:
                - orders
            configs:
              Maven:
                mavenAppName: orders
                artifactType: jar
                mavenProfiles:
                  - local
                  - openshift
                  - openshift-manual
                  - openshift-it
              SpringBoot:
                springBootAppName: orders
                springBootProfiles:
                  - local
                  - openshift
      transformers:
        Buildconfig: m2kassets/inbuilt/transformers/kubernetes/buildconfig/buildconfig.yaml
        CloudFoundry: m2kassets/inbuilt/transformers/cloudfoundry/cloudfoundry.yaml
        ClusterSelector: m2kassets/inbuilt/transformers/kubernetes/clusterselector/clusterselector.yaml
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
    ```

    The plan file contains all the transformers that Move2Kube detected and ran.
    These transformers will be run again during the transformation phase.  
    The plan file also contains all the services that Move2Kube was able to detect.
    The service name comes from the transformer that detected that service.
    We can edit this plan before we move on to the transformation phase. For now we will leave it as is.


## Planning using the UI

1. Bring up the UI:
    ```console
    $ docker run --rm -it -p 8080:8080 quay.io/konveyor/move2kube-ui:v0.3.0-beta.3
    INFO[0000] Starting Move2Kube API server at port: 8080
    ```

1. Create a new workspace
    ![No workspaces]({{ site.baseurl }}/assets/images/migration-workflow/01-no-workspaces.png)
    ![Create a workspace]({{ site.baseurl }}/assets/images/migration-workflow/02-create-workspace.png)
    ![New workspace]({{ site.baseurl }}/assets/images/migration-workflow/03-new-workspace.png)

1. Create a new project
    ![No projects]({{ site.baseurl }}/assets/images/migration-workflow/04-no-projects.png)
    ![Create a project]({{ site.baseurl }}/assets/images/migration-workflow/05-create-project.png)
    ![New project]({{ site.baseurl }}/assets/images/migration-workflow/06-new-project.png)

1. Scroll down to the `project inputs` section and then upload the source directory and the collected information zip files.

    ![No project inputs]({{ site.baseurl }}/assets/images/migration-workflow/07-no-project-inputs.png)
    ![No project inputs]({{ site.baseurl }}/assets/images/migration-workflow/08-upload-project-input-1.png)
    ![No project inputs]({{ site.baseurl }}/assets/images/migration-workflow/09-upload-project-input-2.png)
    ![No project inputs]({{ site.baseurl }}/assets/images/migration-workflow/10-src-uploaded.png)
    ![No project inputs]({{ site.baseurl }}/assets/images/migration-workflow/11-upload-project-input-3.png)
    ![No project inputs]({{ site.baseurl }}/assets/images/migration-workflow/12-cf-uploaded.png)

1. Scroll down to the planning section and click `Start Planning`.

    ![No project inputs]({{ site.baseurl }}/assets/images/migration-workflow/13-no-plan.png)

    Planning can take a few minutes.

    ![No project inputs]({{ site.baseurl }}/assets/images/migration-workflow/14-new-plan.png)

1.  Once the plan has been generated we can move on to the next step.

Now that we have generated a plan file we can move on to the transformation phase which generates the output we need to deploy our app to Kubernetes.

Next step [Transform](/tutorials/migration-workflow/transform)
