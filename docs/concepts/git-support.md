---
layout: default
title: Git Support
permalink: /concepts/git-support
parent: Concepts
nav_order: 5
---

# Git Support

Move2Kube supports git remote paths for `source` and `customization` options for `plan` and `transform` subcommands.

## Git Remote Path Format

To provide git remote path using https, follow the below format

```
git+https://github.com/<org or username>/<repo name>.git:<path to the folder in the git repo>@<branch, tag or commit hash>
```

To provide git remote path using ssh, follow the below format

```
git+ssh://github.com/<org or username>/<repo name>.git:<path to the folder in the git repo>@<branch, tag or commit hash>
```

## Examples

* Perform move2kube plan with source as git remote path

    <details markdown="block">
    <summary markdown="block">
    ```console
    move2kube plan -s git+https://github.com/konveyor/move2kube-demos.git:samples/kubernetes-to-kubernetes
    ```
    </summary>
    ```console
    INFO[0000] Cloning the repository using git into /var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube634143840/m2ksources. This might take some time.
    INFO[0047] Configuration loading done
    INFO[0047] Start planning
    INFO[0047] Planning started on the base directory: '/var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube634143840/m2ksources/konveyor/move2kube-demos.git/samples/kubernetes-to-kubernetes'
    INFO[0047] [ComposeAnalyser] Planning
    INFO[0047] [ComposeAnalyser] Done
    INFO[0047] [CloudFoundry] Planning
    INFO[0047] [CloudFoundry] Done
    INFO[0047] [DockerfileDetector] Planning
    INFO[0047] [DockerfileDetector] Done
    INFO[0047] [Base Directory] Identified 0 named services and 0 to-be-named services
    INFO[0047] Planning finished on the base directory: '/var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube634143840/m2ksources/konveyor/move2kube-demos.git/samples/kubernetes-to-kubernetes'
    INFO[0047] Planning started on its sub directories
    INFO[0047] Identified 1 named services and 0 to-be-named services in .
    INFO[0047] Identified 1 named services and 0 to-be-named services in .
    INFO[0047] Planning finished on its sub directories
    INFO[0047] [Directory Walk] Identified 1 named services and 1 to-be-named services
    INFO[0047] [Named Services] Identified 1 named services
    INFO[0047] Planning done. Number of services identified: 1
    INFO[0047] Plan can be found at [//Users/user/Desktop/tutorial/m2k.plan].
    ```
    </details>


* Perform move2kube plan with source and customizations git remote path

    <details markdown="block">
    <summary markdown="block">
    ```console
    move2kube plan -s git+https://github.com/konveyor/move2kube-demos.git:samples/kubernetes-to-kubernetes -c git+https://github.com/konveyor/move2kube-transformers.git:custom-cluster-selector
    ```
    </summary>
    ```console
    INFO[0000] Cloning the repository using git into /var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube1929598279/m2ksources. This might take some time.
    INFO[0006] Cloning the repository using git into /var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube1929598279/m2kcustomizations. This might take some time.
    INFO[0007] Configuration loading done
    INFO[0007] Start planning
    INFO[0007] Planning started on the base directory: '/var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube1929598279/m2ksources/konveyor/move2kube-demos.git/samples/kubernetes-to-kubernetes'
    INFO[0007] [CloudFoundry] Planning
    INFO[0007] [CloudFoundry] Done
    INFO[0007] [ComposeAnalyser] Planning
    INFO[0007] [ComposeAnalyser] Done
    INFO[0007] [DockerfileDetector] Planning
    INFO[0007] [DockerfileDetector] Done
    INFO[0007] [Base Directory] Identified 0 named services and 0 to-be-named services
    INFO[0007] Planning finished on the base directory: '/var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube1929598279/m2ksources/konveyor/move2kube-demos.git/samples/kubernetes-to-kubernetes'
    INFO[0007] Planning started on its sub directories
    INFO[0007] Identified 1 named services and 0 to-be-named services in .
    INFO[0007] Identified 1 named services and 0 to-be-named services in .
    INFO[0007] Planning finished on its sub directories
    INFO[0007] [Directory Walk] Identified 1 named services and 1 to-be-named services
    INFO[0007] [Named Services] Identified 1 named services
    INFO[0007] Planning done. Number of services identified: 1
    INFO[0047] Plan can be found at [/Users/user/Desktop/tutorial/m2k.plan].
    ```
    </details>


* Perform move2kube transform with source as git remote path


    <details markdown="block">
    <summary markdown="block">
    ```console
    move2kube transform -s git+https://github.com/konveyor/move2kube-demos.git:samples/kubernetes-to-kubernetes
    ```
    </summary>
    ```console
    INFO[0000] Cloning the repository using git into /var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube2368627818/m2ksources. This might take some time.
    ? Specify a Kubernetes style selector to select only the transformers that you want to run.
    ID: move2kube.transformerselector
    Hints:
    - Leave empty to select everything. This is the default.


    ? Select all transformer types that you are interested in:
    ID: move2kube.transformers.types
    Hints:
    - Services that don't support any of the transformer types you are interested in will be ignored.

    ArgoCD, Buildconfig, CNBContainerizer, CloudFoundry, ClusterSelector, ComposeAnalyser, ComposeGenerator, ContainerImagesPushScriptGenerator, DockerfileDetector, DockerfileImageBuildScript, DockerfileParser, DotNetCore-Dockerfile, EarAnalyser, EarRouter, Golang-Dockerfile, Gradle, Jar, Jboss, Knative, Kubernetes, KubernetesVersionChanger, Liberty, Maven, Nodejs-Dockerfile, OperatorTransformer, OperatorsFromTCA, PHP-Dockerfile, Parameterizer, Python-Dockerfile, ReadMeGenerator, Ruby-Dockerfile, Rust-Dockerfile, Tekton, Tomcat, WarAnalyser, WarRouter, WinWebApp-Dockerfile, ZuulAnalyser
    ? Allow spawning containers?
    ID: move2kube.spawncontainers
    Hints:
    - If this setting is set to false, those transformers that rely on containers will not work.

    No
    INFO[0005] Configuration loading done
    INFO[0005] Start planning
    INFO[0005] Planning started on the base directory: '/var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube2368627818/m2ksources/konveyor/move2kube-demos.git/samples/kubernetes-to-kubernetes'
    INFO[0005] [CloudFoundry] Planning
    INFO[0005] [CloudFoundry] Done
    INFO[0005] [ComposeAnalyser] Planning
    INFO[0005] [ComposeAnalyser] Done
    INFO[0005] [DockerfileDetector] Planning
    INFO[0006] [DockerfileDetector] Done
    INFO[0006] [Base Directory] Identified 0 named services and 0 to-be-named services
    INFO[0006] Planning finished on the base directory: '/var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube2368627818/m2ksources/konveyor/move2kube-demos.git/samples/kubernetes-to-kubernetes'
    INFO[0006] Planning started on its sub directories
    INFO[0006] Identified 1 named services and 0 to-be-named services in .
    INFO[0006] Identified 1 named services and 0 to-be-named services in .
    INFO[0006] Planning finished on its sub directories
    INFO[0006] [Directory Walk] Identified 1 named services and 1 to-be-named services
    INFO[0006] [Named Services] Identified 1 named services
    INFO[0006] Planning done. Number of services identified: 1
    INFO[0006] Starting transformation
    ? Select all services that are needed:
    ID: move2kube.services.[].enable
    Hints:
    - The services unselected here will be ignored.

    move2kube-demos
    INFO[0006] Found multiple transformation options for the service 'move2kube-demos'. Selecting the first valid option.
    INFO[0006] Using the transformation option 'KubernetesVersionChanger' for the service 'move2kube-demos'.
    INFO[0006] Iteration 1
    INFO[0006] Iteration 2 - 1 artifacts to process
    INFO[0006] Transformer 'ClusterSelector' processing 1 artifacts
    ? Choose the cluster type:
    ID: move2kube.target."default".clustertype
    Hints:
    - Choose the cluster type you would like to target

    Kubernetes
    INFO[0006] Transformer ClusterSelector Done
    INFO[0006] Transformer 'KubernetesVersionChanger' processing 1 artifacts
    INFO[0006] Transformer KubernetesVersionChanger Done
    INFO[0006] Created 1 pathMappings and 1 artifacts. Total Path Mappings : 1. Total Artifacts : 1.
    INFO[0006] Iteration 3 - 1 artifacts to process
    INFO[0006] Transformer 'Parameterizer' processing 1 artifacts
    INFO[0006] Transformer Parameterizer Done
    INFO[0006] Transformation done
    INFO[0006] Transformed target artifacts can be found at [/Users/user/Desktop/tutorial/myproject].
    ```
    </details>

* Perform move2kube transform with source and customizations git remote path


    <details markdown="block">
    <summary markdown="block">
    ```console
    move2kube transform -s git+https://github.com/konveyor/move2kube-demos.git:samples/kubernetes-to-kubernetes -c git+https://github.com/konveyor/move2kube-transformers.git:custom-cluster-selector
    ```
    </summary>
    ```console
    INFO[0000] Cloning the repository using git into /var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube3272926759/m2ksources. This might take some time.
    INFO[0004] Cloning the repository using git into /var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube3272926759/m2kcustomizations. This might take some time.
    ? Specify a Kubernetes style selector to select only the transformers that you want to run.
    ID: move2kube.transformerselector
    Hints:
    - Leave empty to select everything. This is the default.


    ? Select all transformer types that you are interested in:
    ID: move2kube.transformers.types
    Hints:
    - Services that don't support any of the transformer types you are interested in will be ignored.

    ArgoCD, Buildconfig, CNBContainerizer, CloudFoundry, ComposeAnalyser, ComposeGenerator, ContainerImagesPushScriptGenerator, CustomClusterSelector, DockerfileDetector, DockerfileImageBuildScript, DockerfileParser, DotNetCore-Dockerfile, EarAnalyser, EarRouter, Golang-Dockerfile, Gradle, Jar, Jboss, Knative, Kubernetes, KubernetesVersionChanger, Liberty, Maven, Nodejs-Dockerfile, OperatorTransformer, OperatorsFromTCA, PHP-Dockerfile, Parameterizer, Python-Dockerfile, ReadMeGenerator, Ruby-Dockerfile, Rust-Dockerfile, Tekton, Tomcat, WarAnalyser, WarRouter, WinWebApp-Dockerfile, ZuulAnalyser
    ? Allow spawning containers?
    ID: move2kube.spawncontainers
    Hints:
    - If this setting is set to false, those transformers that rely on containers will not work.

    No
    INFO[0010] Configuration loading done
    INFO[0010] Start planning
    INFO[0010] Planning started on the base directory: '/var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube3272926759/m2ksources/konveyor/move2kube-demos.git/samples/kubernetes-to-kubernetes'
    INFO[0010] [CloudFoundry] Planning
    INFO[0010] [CloudFoundry] Done
    INFO[0010] [ComposeAnalyser] Planning
    INFO[0010] [ComposeAnalyser] Done
    INFO[0010] [DockerfileDetector] Planning
    INFO[0010] [DockerfileDetector] Done
    INFO[0010] [Base Directory] Identified 0 named services and 0 to-be-named services
    INFO[0010] Planning finished on the base directory: '/var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube3272926759/m2ksources/konveyor/move2kube-demos.git/samples/kubernetes-to-kubernetes'
    INFO[0010] Planning started on its sub directories
    INFO[0010] Identified 1 named services and 0 to-be-named services in .
    INFO[0010] Identified 1 named services and 0 to-be-named services in .
    INFO[0010] Planning finished on its sub directories
    INFO[0010] [Directory Walk] Identified 1 named services and 1 to-be-named services
    INFO[0010] [Named Services] Identified 1 named services
    INFO[0010] Planning done. Number of services identified: 1
    INFO[0010] Starting transformation
    ? Select all services that are needed:
    ID: move2kube.services.[].enable
    Hints:
    - The services unselected here will be ignored.

    move2kube-demos
    INFO[0010] Found multiple transformation options for the service 'move2kube-demos'. Selecting the first valid option.
    INFO[0010] Using the transformation option 'KubernetesVersionChanger' for the service 'move2kube-demos'.
    INFO[0010] Iteration 1
    INFO[0010] Iteration 2 - 1 artifacts to process
    INFO[0010] Transformer 'CustomClusterSelector' processing 1 artifacts
    ? Choose the cluster type:
    ID: move2kube.target."default".clustertype
    Hints:
    - Choose the cluster type you would like to target

    Kubernetes
    INFO[0010] Transformer CustomClusterSelector Done
    INFO[0010] Transformer 'KubernetesVersionChanger' processing 1 artifacts
    INFO[0010] Transformer KubernetesVersionChanger Done
    INFO[0010] Created 1 pathMappings and 1 artifacts. Total Path Mappings : 1. Total Artifacts : 1.
    INFO[0010] Iteration 3 - 1 artifacts to process
    INFO[0010] Transformer 'Parameterizer' processing 1 artifacts
    INFO[0010] Transformer Parameterizer Done
    INFO[0010] Transformation done
    INFO[0006] Transformed target artifacts can be found at [/Users/user/Desktop/tutorial/myproject].
    ```
    </details>

* Perform move2kube transform with source as git remote path with release-0.2 as branch


    <details markdown="block">
    <summary markdown="block">
    ```console
    move2kube transform -s git+https://github.com/konveyor/move2kube-demos.git:samples/kubernetes-to-kubernetes@release-0.2
    ```
    </summary>
    ```console
    INFO[0000] Cloning the repository using git into /var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube64372906/m2ksources. This might take some time.
    ? Specify a Kubernetes style selector to select only the transformers that you want to run.
    ID: move2kube.transformerselector
    Hints:
    - Leave empty to select everything. This is the default.


    ? Select all transformer types that you are interested in:
    ID: move2kube.transformers.types
    Hints:
    - Services that don't support any of the transformer types you are interested in will be ignored.

    ArgoCD, Buildconfig, CNBContainerizer, CloudFoundry, ClusterSelector, ComposeAnalyser, ComposeGenerator, ContainerImagesPushScriptGenerator, DockerfileDetector, DockerfileImageBuildScript, DockerfileParser, DotNetCore-Dockerfile, EarAnalyser, EarRouter, Golang-Dockerfile, Gradle, Jar, Jboss, Knative, Kubernetes, KubernetesVersionChanger, Liberty, Maven, Nodejs-Dockerfile, OperatorTransformer, OperatorsFromTCA, PHP-Dockerfile, Parameterizer, Python-Dockerfile, ReadMeGenerator, Ruby-Dockerfile, Rust-Dockerfile, Tekton, Tomcat, WarAnalyser, WarRouter, WinWebApp-Dockerfile, ZuulAnalyser
    ? Allow spawning containers?
    ID: move2kube.spawncontainers
    Hints:
    - If this setting is set to false, those transformers that rely on containers will not work.

    No
    INFO[0016] Configuration loading done
    INFO[0016] Start planning
    INFO[0016] Planning started on the base directory: '/var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube64372906/m2ksources/konveyor/move2kube-demos.git/samples/kubernetes-to-kubernetes'
    INFO[0016] [CloudFoundry] Planning
    INFO[0016] [CloudFoundry] Done
    INFO[0016] [ComposeAnalyser] Planning
    INFO[0016] [ComposeAnalyser] Done
    INFO[0016] [DockerfileDetector] Planning
    INFO[0016] [DockerfileDetector] Done
    INFO[0016] [Base Directory] Identified 0 named services and 0 to-be-named services
    INFO[0016] Planning finished on the base directory: '/var/folders/65/8blqnjn175s37p_k6s2n50nm0000gq/T/move2kube64372906/m2ksources/konveyor/move2kube-demos.git/samples/kubernetes-to-kubernetes'
    INFO[0016] Planning started on its sub directories
    INFO[0016] Identified 1 named services and 0 to-be-named services in .
    INFO[0016] Identified 1 named services and 0 to-be-named services in .
    INFO[0016] Planning finished on its sub directories
    INFO[0016] [Directory Walk] Identified 1 named services and 1 to-be-named services
    INFO[0016] [Named Services] Identified 1 named services
    INFO[0016] Planning done. Number of services identified: 1
    INFO[0016] Starting transformation
    ? Select all services that are needed:
    ID: move2kube.services.[].enable
    Hints:
    - The services unselected here will be ignored.

    move2kube-demos
    INFO[0016] Found multiple transformation options for the service 'move2kube-demos'. Selecting the first valid option.
    INFO[0016] Using the transformation option 'KubernetesVersionChanger' for the service 'move2kube-demos'.
    INFO[0016] Iteration 1
    INFO[0016] Iteration 2 - 1 artifacts to process
    INFO[0016] Transformer 'ClusterSelector' processing 1 artifacts
    ? Choose the cluster type:
    ID: move2kube.target."default".clustertype
    Hints:
    - Choose the cluster type you would like to target

    Kubernetes
    INFO[0016] Transformer ClusterSelector Done
    INFO[0016] Transformer 'KubernetesVersionChanger' processing 1 artifacts
    INFO[0016] Transformer KubernetesVersionChanger Done
    INFO[0016] Created 1 pathMappings and 1 artifacts. Total Path Mappings : 1. Total Artifacts : 1.
    INFO[0016] Iteration 3 - 1 artifacts to process
    INFO[0016] Transformer 'Parameterizer' processing 1 artifacts
    INFO[0016] Transformer Parameterizer Done
    INFO[0016] Transformation done
    INFO[0006] Transformed target artifacts can be found at [/Users/user/Desktop/tutorial/myproject].
    ```
    </details>
