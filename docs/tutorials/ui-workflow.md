---
layout: default
title: "Using Move2Kube UI"
permalink: /tutorials/ui
parent: Tutorials
nav_order: 2
---

# Using Move2Kube UI

## Description

Similar to the command line tool, Move2Kube Web-UI can also be used to do the transformation. The Web-UI has all the capabilities that are there in the command line tool. This document explains the steps to bring up the UI and backend using docker and use it for transformation.

## Prerequisites

1. Install [Docker](https://www.docker.com/get-started).

1. Download [language-platforms.zip](https://github.com/konveyor/move2kube-demos/raw/main/samples/language-platforms.zip) which we will be using for this tutorial. The language-platforms.zip file has a combination of multiple applications in different languages (Java, Go, Python, Ruby, etc.) which needs to be containerized and then put into Kubernetes.

## Steps to use the UI to do a transformation

1. Do a `docker run --rm -it -p 8080:8080 quay.io/konveyor/move2kube-ui`.  
    ```console
    $ docker run --rm -it -p 8080:8080 quay.io/konveyor/move2kube-ui
    INFO[0000] Starting Move2Kube API server at port: 8080
    ```

    It starts a container using the Move2Kube UI image. Once it's up the UI will be available on port `8080`.

    >
        Optionally if you need persistence then mount the current directory:
        $ docker run --rm -it -p 8080:8080 -v "${PWD}/move2kube-api-data:/move2kube-api/data" quay.io/konveyor/move2kube-ui:latest

        And if you also need more advanced features of Move2Kube then mount the docker socket. This will allow Move2Kube to run container based transformers:
        $ docker run --rm -it -p 8080:8080 -v "${PWD}/move2kube-api-data:/move2kube-api/data" -v //var/run/docker.sock:/var/run/docker.sock quay.io/konveyor/move2kube-ui:latest

1. Open `http://localhost:8080/` in your browser.

1. Create a new workspace `Workspace 1` by clicking on the `New Workspace` button.

    ![No workspaces]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/01-no-workspaces.png)
    ![Create workspace]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/03-create-workspace.png)
    ![New workspace]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/04-new-workspace.jpeg)

1. Scroll down and create a new project `Project 1` by clicking on the `New Project` button.

    ![No projects]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/05-no-projects.png)
    ![Create project]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/07-create-project.jpeg)
    ![New project]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/08-new-project.jpeg)

1. Scroll down to the `Project inputs` section and upload the [language-platforms.zip](https://github.com/konveyor/move2kube-demos/blob/main/samples/language-platforms.zip) file which we downloaded earlier in this tutorial and wait for it to finish uploading.

    ![No project inputs]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/09-no-project-inputs.jpeg)
    ![Create project input]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/11-create-project-input.jpeg)
    ![New project input]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/12-new-project-input.png)

1. Now scroll down to the `Plan` section and click on the `Start Planning` button. Wait for the plan to get generated. It takes about three to five minutes to generate the plan.

    ![No plan]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/13-no-plan.png)
    ![Start planning]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/14-start-planning.png)

1. Once the plan is generated you can scroll to see the different services. The plan is in YAML format. If you edit the plan don't forget to click `Save`.

    ![Planning finished]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/15-planning-finished.png)

1. Now scroll down to `Outputs` section and click on the `Start Transformation` button.

    ![No outputs]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/16-no-project-outputs.png)

1. Move2Kube will ask some questions to aid in the transfomation process.

    For the question about container registry, specify the container registry where you want to push the images.
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/30-qa-14.jpeg)

    Same for the question about container registry namespace.
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/31-qa-15.jpeg)

    If your container registry requires authentication for pulling images, then specify that in the question about container registry login.
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/32-qa-16.jpeg)

    For the question about ingress host, specify the hostname of the Kubernetes cluster. If you are deploying to Minikube then specify `localhost` as the hostname and leave the TLS secret blank.
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/33-qa-17.jpeg)
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/34-qa-18.jpeg)

    For all other questions we can keep clicking the `Next` button and go with the default answers. 

    ![Start transformation]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/17-qa-1.png)
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/18-qa-2.jpeg)
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/19-qa-3.png)
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/20-qa-4.png)
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/21-qa-5.png)
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/22-qa-6.png)
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/23-qa-7.png)
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/24-qa-8.jpeg)
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/25-qa-9.jpeg)
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/26-qa-10.jpeg)
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/27-qa-11.jpeg)
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/28-qa-12.jpeg)
    ![Transformation QA]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/29-qa-13.jpeg)

1. After the questions are finished wait a few minutes for it to finish processing. Once it's done, you can click on the output to download the generated artifacts as a zip file (here `workspace-1-project-1-output-1989fd2d-4be1-4316-b368-309f5349cfad.zip`), extract it and browse them. The applications can now be deployed to Kubernetes using these generated artifacts.

    ![Transformation finished]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/35-transformation-finished.png)
    ![Download output]({{ site.baseurl }}/assets/images/new-m2k-ui-screenshots/36-download-output.jpeg)

Now we can build and push the container images and deploy to Kubernetes using the output we downloaded.  
The steps for doing that are same as for the [CLI tutorial]({{ site.baseurl }}/tutorials/cli#deploying-the-application-to-kubernetes-with-the-generated-artifacts).  

## Conclusion

We have seen how easy it is to to do a transformation using the UI. All the features of the Move2Kube CLI are available through the UI as well.
In addition, the UI can be hosted on a common server and used by different teams using different workspaces.
It also has authentication and authorization capabilities to restrict access to particular workspaces.
