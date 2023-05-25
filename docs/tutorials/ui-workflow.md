---
layout: default
title: "Using Move2Kube UI"
permalink: /tutorials/ui
parent: Tutorials
nav_order: 3
---

# Using the Move2Kube UI

## Description

Similar to the command line tool, Move2Kube Web-UI can also be used to do the transformation. The Web-UI has all the capabilities that are there in the command line tool. This document explains the steps to bring up the UI and backend using docker and use it for transformation.

## Prerequisites

1. Install [Docker](https://www.docker.com/get-started).

1. We will use [language-platforms](https://github.com/konveyor/move2kube-demos/raw/main/samples/language-platforms) sample. The language-platforms file has a combination of multiple applications in different languages (Java, Go, Python, Ruby, etc.) which needs to be containerized and then put into Kubernetes.

## Steps to use the UI to do a transformation

1. Download the language platforms sample as a zip. 
    ```console
    $ curl https://move2kube.konveyor.io/scripts/download.sh | bash -s -- -d samples/language-platforms -r move2kube-demos -z
    $ ls
    language-platforms.zip
    ```

1. Do a `docker run --rm -it -p 8080:8080 quay.io/konveyor/move2kube-ui`.  
    ```console
    $ docker run --rm -it -p 8080:8080 quay.io/konveyor/move2kube-ui
    INFO[0000] Starting Move2Kube API server at port: 8080
    ```

    It starts a container using the Move2Kube UI image on port `8080`.

    ```console
    # Optionally if you need persistence then mount the current directory:
    $ docker run --rm -it -p 8080:8080 -v "${PWD}/move2kube-api-data:/move2kube-api/data" quay.io/konveyor/move2kube-ui:latest
    # And if you also need more advanced features of Move2Kube then mount the docker socket. This will allow Move2Kube to run container based transformers:
    $ docker run --rm -it -p 8080:8080 -v "${PWD}/move2kube-api-data:/move2kube-api/data" -v //var/run/docker.sock:/var/run/docker.sock quay.io/konveyormove2kube-ui:latest
    ```

1. Open [http://localhost:8080](http://localhost:8080) in your browser.

1. Create a new workspace `Workspace 1` by clicking on the `New Workspace` button.

    ![No workspaces]({{ site.baseurl }}/assets/images/ui-workflow/01-no-workspaces.png)
    ![Create workspace]({{ site.baseurl }}/assets/images/ui-workflow/03-create-workspace.png)
    ![New workspace]({{ site.baseurl }}/assets/images/ui-workflow/04-new-workspace.jpeg)

1. Scroll down and create a new project `Project 1` by clicking on the `New Project` button.

    ![No projects]({{ site.baseurl }}/assets/images/ui-workflow/05-no-projects.png)
    ![Create project]({{ site.baseurl }}/assets/images/ui-workflow/07-create-project.jpeg)
    ![New project]({{ site.baseurl }}/assets/images/ui-workflow/08-new-project.jpeg)

1. Scroll down to the `Project inputs` section and upload the language-platforms.zip file which we downloaded earlier in this tutorial and wait for it to finish uploading.

    ![No project inputs]({{ site.baseurl }}/assets/images/ui-workflow/09-no-project-inputs.jpeg)
    ![Create project input]({{ site.baseurl }}/assets/images/ui-workflow/11-create-project-input.jpeg)
    ![New project input]({{ site.baseurl }}/assets/images/ui-workflow/12-new-project-input.png)

1. Now scroll down to the `Plan` section and click on the `Start Planning` button. Wait for the plan to get generated. It takes about three to five minutes to generate the plan.

    ![No plan]({{ site.baseurl }}/assets/images/ui-workflow/13-no-plan.png)
    ![Start planning]({{ site.baseurl }}/assets/images/ui-workflow/14-start-planning.png)

1. Once the plan is generated you can scroll to see the different services. The plan is in YAML format. If you edit the plan don't forget to click `Save`.

    ![Planning finished]({{ site.baseurl }}/assets/images/ui-workflow/15-planning-finished.jpg)

1. Now scroll down to `Outputs` section and click on the `Start Transformation` button.

    ![No outputs]({{ site.baseurl }}/assets/images/ui-workflow/16-no-project-outputs.jpg)

1. Move2Kube will ask some questions to aid in the transformation process.

    ![Start transformation]({{ site.baseurl }}/assets/images/ui-workflow/17-qa-1.jpg)

    For the question about container registry, specify the container registry where you want to push the images.
    ![Transformation QA]({{ site.baseurl }}/assets/images/ui-workflow/30-qa-14.jpg)

    Same for the question about container registry namespace.
    ![Transformation QA]({{ site.baseurl }}/assets/images/ui-workflow/31-qa-15.jpg)

    If your container registry requires authentication for pulling images, then specify that in the question about container registry login.
    ![Transformation QA]({{ site.baseurl }}/assets/images/ui-workflow/32-qa-16.jpg)

    For the question about ingress host, specify the hostname of the Kubernetes cluster. If you are deploying to Minikube then specify `localhost` as the hostname and leave the TLS secret blank.
    ![Transformation QA]({{ site.baseurl }}/assets/images/ui-workflow/33-qa-17.jpg)
    ![Transformation QA]({{ site.baseurl }}/assets/images/ui-workflow/34-qa-18.jpg)

    For all other questions we can keep clicking the `Next` button and go with the default answers. 

1. After the questions are finished wait a few minutes for it to finish processing. Once it's done, you can click on the output to download the generated artifacts as a zip file (here `workspace-1-project-1-output-bcad1e64-23d0-4ea1-ad47-9d060e870b4f.zip`), extract it and browse them. The applications can now be deployed to Kubernetes using these generated artifacts.

    ![Transformation finished]({{ site.baseurl }}/assets/images/ui-workflow/35-transformation-finished.jpg)
    ![Download output]({{ site.baseurl }}/assets/images/ui-workflow/36-download-output.jpg)
    ![Exploring the output]({{ site.baseurl }}/assets/images/ui-workflow/37-exploring-the-output.jpg)

Now we can build and push the container images and deploy to Kubernetes using the output we downloaded.  
The steps for doing that are same as for the [CLI tutorial]({{ site.baseurl }}/tutorials/cli#deploying-the-application-to-kubernetes-with-the-generated-artifacts).  

## Conclusion

We have seen how easy it is to do a transformation using the UI. All the features of the Move2Kube CLI are available through the UI as well.
In addition, the UI can be hosted on a common server and used by different teams using different workspaces.
It also has authentication and authorization capabilities to restrict access to particular workspaces.
