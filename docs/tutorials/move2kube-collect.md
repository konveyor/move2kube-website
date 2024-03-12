---
layout: default
title: "Using Move2Kube Collect for collecting the metadata"
permalink: /tutorials/move2kube-collect/
parent: Tutorials
nav_order: 7
---

# Using Move2Kube Collect for collecting the metadata of Cloud Foundry applications, Kubernetes clusters and images

Move2Kube can be used to collect metadata from multiple sources,like- cluster, image repo, Cloud Foundry, etc., filter and summarize it into a yaml. For this, Move2Kube CLI tool provides a command called `collect`. The `collect` command can be used to collect information about applications running in the Cloud Foundry instance, and/or collect the types of resources that are installed on a Kubernetes/OpenShift cluster, and/or collect the metadata from image repo that can be useful for the Docker Swarm applications.

- Install the latest version of Move2Kube. This tutorial was created using Move2Kube `v0.3.9-rc.0`.

  ```console
  $ MOVE2KUBE_TAG='v0.3.9-rc.0' bash <(curl https://raw.githubusercontent.com/konveyor/move2kube/main/scripts/install.sh)
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  100 10818  100 10818    0     0   4076      0  0:00:02  0:00:02 --:--:--  4082
  Installing move2kube
  Downloading https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64
  The desired Move2Kube version v0.3.9-rc.0 is already installed
  Done!
  cleaning up temporary files and directories...
  ```

  You can check the installed version of Move2Kube by running the below command.

  ```console
  $ move2kube version -l
  version: v0.3.9-rc.0
  gitCommit: 88bb4253f3a0ff90d1ed54f15e5d54acbb51424b
  gitTreeState: clean
  goVersion: go1.18.10
  platform: darwin/arm64
  ```

## Collect Metadata from all the sources (CF, cluster, image repo)

By default, `move2kube collect` tries to collect the metadata information from all the supported sources- Cloud Foundry instance, the Kubernetes cluster and the image repo. `move2kube collect` can also be used to collect the information from only specific source(s), which is discussed in the next sections.

Move2Kube fetches the information from the sources to which you are logged in. For example, to collect the runtime information of Cloud Foundry applications, it is required to be logged in to Cloud Foundry. To collect the metadata about Kubernetes/OpenShift cluster resources, it is required to be logged in to the cluster. Similarly, to collect the information from image repo, it is required to have the *Docker* running on your system.

```console
$ move2kube collect
INFO[0000] Begin collection                             
INFO[0000] [*collector.ClusterCollector] Begin collection 
INFO[0009] [*collector.ClusterCollector] Done           
INFO[0009] [*collector.ImagesCollector] Begin collection 
INFO[0010] [*collector.ImagesCollector] Done            
INFO[0010] [*collector.CfAppsCollector] Begin collection 
INFO[0020] Changing metadata name from IBM Cloud to ibm-cloud 
INFO[0025] [*collector.CfAppsCollector] Done            
INFO[0025] [*collector.CfServicesCollector] Begin collection 
INFO[0028] Changing metadata name from IBM Cloud to ibm-cloud 
INFO[0028] [*collector.CfServicesCollector] Done        
INFO[0028] Collection done                              
INFO[0028] Collect Output in [/Users/move2kube/demo/m2k_collect]. Copy this directory into the source directory to be used for planning.
```

The output is stored in `m2k_collect` folder in the current directory by default. The output folder name can be specified using `move2kube collect -o m2k_collect_new`. Let's look inside the `m2k_collect` folder.

```console
$ ls m2k_collect       
cf       clusters       images
```

Move2Kube has collected the information from CF, cluster and images in the `cf`, `clusters`, `images` folders, respectively.

```console
$  tree m2k_collect
m2k_collect
├── cf
│   ├── cfapps-ibm-cloud-39e7da7a9e635f73.yaml
│   └── cfservices-ibm-cloud-3873c1404a0c63f9.yaml
├── clusters
│   └── IAM-user@mydomain.com-baf6a8a75268b224.yaml
└── images
    ├── move2kube-ui-latest-de7f8e6dc8658168.yaml
    └── nginx-stable-alpine-e331310e2e6af76c.yaml
```

Please Note: In case, if you are not logged in to Cloud Foundry or Kubernetes cluster, it may throw some warning/error messages in the logs as the authorization(s) required were not available. These warning/error messages can be ignored if you are not interested in collecting the metadata from that particular source (say, Cloud Foundry), else login to the source platform and try running `move2kube collect` command again.

```console
ERRO[0010] Unable to get list of cf apps : Error requesting apps: cfclient error (CF-InvalidAuthToken|1000): Invalid Auth Token 
```

To avoid collecting the metadata from all the three sources (CF, clusters, images), and to collect the information from only selected sources, the `--annotations` or `-a` flag can be used.

## Collecting only Cloud Foundry instance runtime metadata

- For collecting information from cf running instance, you might require `cf` CLI or `ibmcloud cf` CLI for logging into Cloud Foundry using `cf login` or `ibmcloud login`.

  ```console
  $ cf version                                               
  cf version 6.53.0+8e2b70a4a.i
  ```

  or

  ```console
  $ ibmcloud cf version                    
  Invoking 'cf version'...
  cf version 6.53.0+8e2b70a4a.2020-10-01
  ```

Run the below command, which uses `-a cf` annotation, to instruct Move2Kube to only collect the runtime information of the applications running in Cloud Foundry. This will not fetch the cluster or images information.

```console
$ move2kube collect -a cf
INFO[0000] Begin collection                             
INFO[0000] [*collector.CfAppsCollector] Begin collection 
INFO[0010] Changing metadata name from IBM Cloud to ibm-cloud 
INFO[0016] [*collector.CfAppsCollector] Done            
INFO[0016] [*collector.CfServicesCollector] Begin collection 
INFO[0020] Changing metadata name from IBM Cloud to ibm-cloud 
INFO[0020] [*collector.CfServicesCollector] Done        
INFO[0020] Collection done                              
INFO[0020] Collect Output in [/Users/move2kube/demo/m2k_collect]. Copy this directory into the source directory to be used for planning.
```

Let's check the `m2k_collect` folder.

```console
$ tree m2k_collect
m2k_collect
└── cf
    ├── cfapps-ibm-cloud-39e7da7a9e635f73.yaml
    └── cfservices-ibm-cloud-3873c1404a0c63f9.yaml
```

The information about the apps such as environment variables, ports, memory, services, and more are collected in the YAML files inside `m2k_collect/cf` folder.

By default, `move2kube collect` collects the information of all the apps that are deployed on Cloud Foundry. But, it is also possible to collect the information of some specific application(s) deployed on Cloud Foundry using `move2kube collect`. A detailed tutorial on how to collect only selected Cloud Foundry application(s) metadata is available [here](/tutorials/collect-selected-cf-apps/).

## Collecting metadata only from Image repos

If you are interested in collecting only the information about the images that are being used in your (Docker Swarm/Docker-Compose) applications you can use the below command, which uses `-a dockerswarm` or `-a dockercompose` annotation with the `movekube collect` command.

```console
move2kube collect -a dockerswarm
INFO[0000] Begin collection                             
INFO[0000] [*collector.ImagesCollector] Begin collection 
INFO[0000] [*collector.ImagesCollector] Done            
INFO[0000] Collection done                              
INFO[0000] Collect Output in [/Users/move2kube/demo/m2k_collect]. Copy this directory into the source directory to be used for planning. 
```

This will collect the information about the images which exist in your system.

```console
$ docker images
REPOSITORY                      TAG             IMAGE ID       CREATED       SIZE
quay.io/konveyor/move2kube-ui   latest          a192738e1b92   5 days ago    212MB
nginx                           stable-alpine   ba1fca8fb480   13 days ago   40.7MB
```

```console
tree m2k_collect                
m2k_collect
└── images
    ├── move2kube-ui-latest-de7f8e6dc8658168.yaml
    └── nginx-stable-alpine-e331310e2e6af76c.yaml
```

For example, let's check the `m2k_collect/images/nginx-stable-alpine-e331310e2e6af76c.yaml` file.

```console
$ cat m2k_collect/images/nginx-stable-alpine-e331310e2e6af76c.yaml
apiVersion: move2kube.konveyor.io/v1alpha1
kind: ImageMetadata
spec:
  tags:
    - nginx:stable-alpine
  ports:
    - 80
  accessedDirs:
    - ""
  userID: -1
```

If you have Docker Compose files, then you can provide the path to the folder containg these Docker Compose files to `move2kube collect`, and it will only collect the information about the images which are being used in these files. The images should be pulled locally before running the collect command.

For example, the `src` folder contains the docker compose file as shown below.

```yaml
version: "3"

services:
    web:
        image: nginx:stable-alpine
        entrypoint:
            [
                "sh",
                "-c",
                'cd /usr/share/nginx/html/ && mkdir web && cp * web/ ; nginx -g "daemon off;"',
            ]
        ports:
            - "8080:80"
```

Run the below command to collect information only about the images (in this case, `nginx:stable-alpine`) which is being used in the given docker-compose file.

```console
$ move2kube collect -a dockercompose -s src
INFO[0000] Begin collection                             
INFO[0000] [*collector.ImagesCollector] Begin collection 
INFO[0000] [*collector.ImagesCollector] Done            
INFO[0000] Collection done                              
INFO[0000] Collect Output in [/Users/move2kube/demo/m2k_collect]. Copy this directory into the source directory to be used for planning.
```

Let's check the contents inside the `m2k_collect` folder.

```console
$ tree m2k_collect
m2k_collect
└── images
    └── nginx-stable-alpine-e331310e2e6af76c.yaml
```

## Collecting only clusters metadata

In this case, we will limit the collect to only cluster information using the `-a k8s` annotation flag. Please note: Before running the below command, log in to your target cluster. To check whether you are logged in to the target cluster run `kubectl get pods`.

```console
    $ move2kube collect -a k8s
    INFO[0000] Begin collection                             
    INFO[0000] [*collector.ClusterCollector] Begin collection 
    INFO[0006] [*collector.ClusterCollector] Done           
    INFO[0006] [*collector.ImagesCollector] Begin collection 
    INFO[0006] [*collector.ImagesCollector] Done            
    INFO[0006] Collection done                              
    INFO[0006] Collect Output in [/Users/move2kube/demo/m2k_collect]. Copy this directory into the source directory to be used for planning.
```

```console
$ tree m2k_collect
m2k_collect
├── clusters
│   └── IAM-user-mydomain.com-baf6a8a75268b224.yaml
└── images
    ├── move2kube-ui-latest-de7f8e6dc8658168.yaml
    └── nginx-stable-alpine-e331310e2e6af76c.yaml
```

If you are logged into Kubernetes/OpenShift clusters, it collects information about the types of resources that are installed on the cluster, whether it has Tekton, BuildConfigs, etc.

A detailed tutorial on  how to customizing Kubernetes YAMLs to target specific cluster is available [here](/tutorials/customize-cluster-selector)

## Next steps

Now, after we have collected the information for the CF apps, clusters, images repo, we can use this collected runtime information during the transform/planning phase by simply copying `m2k_collect` folder into the source directory before starting the `planning`/`transform` phase. The YAMLs inside `m2k_collect` can then be used during the plan phase to get a wholistic plan combining the source and metadata. For example: Some of the collected information is about ports, environment variables information, and memory. This allows Move2Kube to select the right ports and set right environment variables for each service when generating Dockerfiles for containerizing these services.

Run `move2kube transform` (or `move2kube plan`) on the source directory which also contains the copied `m2k_collect` folder.
