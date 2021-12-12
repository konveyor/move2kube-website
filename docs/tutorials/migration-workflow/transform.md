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

## Transforming the source directory using the plan

1. Run `move2kube transform` in the same directory as the plan file. This will detect the plan file and use it to find the source and customizations directory.

1. Answer all the questions as appropriate. For most questions we can go with the default answers. Some questions to watch out for are the one about the container registry you want to use. There's also a question that let's you change the ingress hostname and ingress TLS secret.


Now that we have generated the output we can run `buildimages.sh` to build all the service images, use `pushimages.sh` to push them to a container registry and deploy the Kubernetes yamls using `kubectl apply -f deploy/yamls`.

However after inspecting the output we might see some things we want to change. For example, we might want to add some annotations to the Ingress, maybe change the output directory structure, change which values are parameterized in the Helm chart, generate some new files, etc. For all these user specific requirements and more we can write our own custom transformers.

Next step [Custom transformer 1](/tutorials/migration-workflow/custom-transformer-1)
