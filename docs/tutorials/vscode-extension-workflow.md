---
layout: default
title: "Using Move2Kube VSCode Extension"
permalink: /tutorials/m2k-extension
parent: Tutorials
nav_order: 3
---

# Using the Move2Kube VSCode Extension

## Description

Similar to the command line tool, Move2Kube VSCode extension can also be used to do the transformation. The extension has the capabilities that are in the command line tool. Additionally, it has some quick commands to easily generate helm-charts. This document explains the steps to use the extension for transformation.

## Prerequisites

1. Install the [Move2Kube CLI tool](https://move2kube.konveyor.io/installation/cli). Make sure the cli is added to `path`.

1. Install the [Move2Kube VS Code extension](https://marketplace.visualstudio.com/items?itemName=konveyor.move2kube-vscode-extension). You can also find the extension by opening `Extension` panel and type `Move2Kube`.

2. We will use [language-platforms](https://github.com/konveyor/move2kube-demos/raw/main/samples/language-platforms) sample. The `language-platforms` directory has a combination of multiple applications in different languages (Java, Go, Python, Ruby, etc.) which need to be containerized and deployed to Kubernetes.

## Steps to use the extension to do a transformation

1. Download the language platforms sample. Each directory contains a simple web application written in different languages.
    ```console
    $ curl https://move2kube.konveyor.io/scripts/download.sh | bash -s -- -d samples/language-platforms -r move2kube-demos

    $ ls language-platforms
    django		golang		java-gradle	java-gradle-war	java-maven	java-maven-war	nodejs		php		python		ruby		rust
    ```

1. Open vscode in the same location where the language-platforms folder is present.
    ```console
    $ code .
    ```

1. Open the file explorer. We can see the `language-platforms` folder in the explorer. We will run transformations on this directory.

    ![Language Platforms Folder]({{ site.baseurl }}/assets/images/extension-workflow/m2k-folder-1.png)

1. To run transformation, `right-click` on `language-platforms` folder. The `Move2Kube` extension's commands will appear in the menu. For transformation, select `Move2Kube: Run Transform` from the menu.

    ![Menu Options]({{ site.baseurl }}/assets/images/extension-workflow/m2k-menu-options-2.png)

1. Three sub-menu options will appear. You can choose `Move2Kube: Transformation  + All Options` for using all options available for transformation.
For this tutorial, select `Move2Kube: Simple Transformation`. Once, you click on this, the extension will begin the transformation process.

1. Move2Kube will ask some questions to aid in the transformation process.It has three options and user can choose accordingly.

    ![Start transformation]({{ site.baseurl }}/assets/images/extension-workflow/m2k-questions-3.png)

1. For the tutorial, select `Yes(default)` to answer them in terminal. This will then pop up a terminal in the screen with the questions.

    ![Terminal Questions]({{ site.baseurl }}/assets/images/extension-workflow/m2k-answer-in-terminal-4.png)

    For most questions we can go with the default answers. Some questions to watch out for are:
    - The container registry and namespace that you want to use. A container registry is where all the images are stored (Example: Quay, Docker Hub, etc.)
    - The ingress hostname and ingress TLS secret. If you are deploying to MiniKube then give `localhost` as the ingress host and leave the TLS secret blank.


1. After the questions are finished, wait a few minutes for it to finish processing. Once the processing is done, we can see a new output folder `m2koutput` being generated in the file explorer.

    ![Transformation Done]({{ site.baseurl }}/assets/images/extension-workflow/m2k-transformation-done-5.png)

1. If we take a look at the generated folder, we can find `deploy`, `scripts` and other `configuration` files being generated through the transformation process.

    ![Output Folder]({{ site.baseurl }}/assets/images/extension-workflow/m2k-output-folder-6.png)

The applications now can be deployed to Kubernetes using these generated artifacts. We can build and push the container images and deploy to Kubernetes using the output generated.
The steps for doing that are same as for the [CLI Tutorial]({{ site.baseurl }}/tutorials/cli#deploying-the-application-to-kubernetes-with-the-generated-artifacts).


## Conclusion

We have seen how easy it is to do a transformation using the extension. All the features of Move2Kube transformation is available in the extension.
In addition, the extension has `Move2Kube: Add helm chart` option to generate helm charts within the source directory.
