---
layout: default
title: "Using Move2Kube API"
permalink: /tutorials/api
parent: Tutorials
nav_order: 2
---

# Using the Move2Kube API

## Description

In this tutorial we will look at how to use Move2Kube more programmatically using the API server. [https://github.com/konveyor/move2kube-api](https://github.com/konveyor/move2kube-api)

Move2Kube has a REST API server that lets you upload files/directories, transform them and download the output.
The API server provides a way for multiple teams to collaborate using a single deployment of Move2Kube.
It also makes it possible to run Move2Kube on a Kubernetes cluster and expose it for use.

The usual way to interact with the API is through the UI [https://github.com/konveyor/move2kube-ui](https://github.com/konveyor/move2kube-ui)  
However, you might want to have programmatic access in some cases (Example: when integrating Move2Kube with other tools).
This tutorial covers the basics of the API workflow: from starting the server, to doing a transformation.
For more detailed information you can refer to the Swagger/OpenAPI spec [https://github.com/konveyor/move2kube-api/blob/main/assets/openapi.json](https://github.com/konveyor/move2kube-api/blob/main/assets/openapi.json)

## Prerequisites

1. Docker/Podman. If you don't have Docker/Podman you can download and run the Move2Kube API binary directly [https://github.com/konveyor/move2kube-api/releases](https://github.com/konveyor/move2kube-api/releases)  
We provide pre-built binaries for Windows/Linux/MacOS for x86 and ARM architectures.

1. We will use the [language-platforms](https://github.com/konveyor/move2kube-demos/raw/main/samples/language-platforms) sample. The `language-platforms` directory has a combination of multiple applications in different languages (Java, Go, Python, Ruby, etc.) which need to be containerized and deployed to Kubernetes.
Please download the folder and create a `.zip` file out of it.

## Steps to use the API to do a transformation

1. Start the server
    ```console
    $ docker run --rm -it -p 8080:8080 quay.io/konveyor/move2kube-api
    ```
    and go to [http://localhost:8080/swagger](http://localhost:8080/swagger)  
    If you don't have Docker/Podman, then you can start the server using the binary you downloaded
    ```console
    $ ./move2kube-api
    ```

1. List the workspaces, currently we have no workspaces.
    ```console
    $ curl -i 'http://localhost:8080/api/v1/workspaces'
    ```

1. Create a workspace. (Note: The `id` of the workspace will be in the response.)
    ```console
    $ curl -iX POST 'http://localhost:8080/api/v1/workspaces' \
        -H 'Content-Type: application/json' \
        --data '{"name": "Team 1 Workspace",  "description": "The workspace team 1 uses."}'
    ```
    ![Create workspace button]({{ site.baseurl }}/assets/images/api-workflow/01-create-workspace-button.png)
    ![Create a workspace]({{ site.baseurl }}/assets/images/api-workflow/02-create-workspace.png)

1. List the workspaces again to see the workspace you just created.
    ```console
    $ curl -i 'http://localhost:8080/api/v1/workspaces'
    ```
    ![List workspaces again]({{ site.baseurl }}/assets/images/api-workflow/03-list-workspaces-again.png)

1. Now scroll down to the Projects section and list the projects in the workspace. Currently we have no projects in this workspace.
    (Note: Replace the workspace UUID in the URL with the `id` you got earlier)
    ```console
    $ curl -i 'http://localhost:8080/api/v1/workspaces/c16f3be9-413c-406a-89b7-ea463950780e/projects'
    ```
    ![Projects section]({{ site.baseurl }}/assets/images/api-workflow/04-projects-section.png)
    ![List projects]({{ site.baseurl }}/assets/images/api-workflow/05-list-projects-empty.png)

1. Create a project. (Note: The `id` of the project will be in the response.)
    ```console
    $ curl -iX POST 'http://localhost:8080/api/v1/workspaces/c16f3be9-413c-406a-89b7-ea463950780e/projects' \
        -H 'Content-Type: application/json' \
        --data '{"name": "My Web App 1", "description": "Project to transform my web app 1 to run on K8s."}'
    ```
    ![Create a project]({{ site.baseurl }}/assets/images/api-workflow/06-create-project.png)

1. List the projects again to see the project you just created.
    ```console
    $ curl -i 'http://localhost:8080/api/v1/workspaces/c16f3be9-413c-406a-89b7-ea463950780e/projects'
    ```
    ![List projects again]({{ site.baseurl }}/assets/images/api-workflow/07-list-projects-again.png)

1. Now scroll down to the Project inputs section and create an input. Select `sources` at the type of input. We will upload the `language-platforms.zip` file as our input.
    (Note: Replace the workspace and project UUIDs in the URL with the `id`s you got earlier)
    ```console
    $ curl -iX POST 'http://localhost:8080/api/v1/workspaces/c16f3be9-413c-406a-89b7-ea463950780e/projects/e9a94c62-77a4-480b-ae4e-33307a5a600b/inputs' \
        -F type=sources \
        -F filename='language-platforms.zip' \
        -F file=@/path/to/language-platforms.zip
    ```
    ![Project inputs section]({{ site.baseurl }}/assets/images/api-workflow/08-project-inputs-section.png)
    ![Create a project input]({{ site.baseurl }}/assets/images/api-workflow/09-create-project-input.png)
    ![Create a project input continued]({{ site.baseurl }}/assets/images/api-workflow/10-create-project-input-file.png)

1. Get the project to see the input that we just created.
    ```console
    $ curl -i 'http://localhost:8080/api/v1/workspaces/c16f3be9-413c-406a-89b7-ea463950780e/projects/e9a94c62-77a4-480b-ae4e-33307a5a600b'
    ```
    ![Get project to see the inputs]({{ site.baseurl }}/assets/images/api-workflow/11-get-project.png)
    ![Get project to see the inputs continued]({{ site.baseurl }}/assets/images/api-workflow/12-get-project-response.png)

1. Now scroll down to the Plan section and try to get the plan. Currently we have no plan for this project, so we get a `404 Not Found` error.
    ```console
    $ curl -i 'http://localhost:8080/api/v1/workspaces/c16f3be9-413c-406a-89b7-ea463950780e/projects/e9a94c62-77a4-480b-ae4e-33307a5a600b/plan'
    ```
    ![Plan section]({{ site.baseurl }}/assets/images/api-workflow/13-plan-section.png)
    ![Empty plan]({{ site.baseurl }}/assets/images/api-workflow/14-empty-plan.png)

1. Start the planning for the project.
    ```console
    $ curl -iX POST 'http://localhost:8080/api/v1/workspaces/c16f3be9-413c-406a-89b7-ea463950780e/projects/e9a94c62-77a4-480b-ae4e-33307a5a600b/plan'
    ```
    ![Start planning]({{ site.baseurl }}/assets/images/api-workflow/15-start-planning.png)
    ![Response to start planning]({{ site.baseurl }}/assets/images/api-workflow/16-start-planning-response.png)

1. Download the plan once planning finishes.
    ```console
    $ curl -i 'http://localhost:8080/api/v1/workspaces/c16f3be9-413c-406a-89b7-ea463950780e/projects/e9a94c62-77a4-480b-ae4e-33307a5a600b/plan'
    ```
    ![Get plan again]({{ site.baseurl }}/assets/images/api-workflow/17-get-plan-again.png)
    ![Get plan after planning]({{ site.baseurl }}/assets/images/api-workflow/18-get-plan-after-planning.png)

1. Now scroll down to the Project outputs section and start a transformation by creating an output. (Note: The `id` of the output will be in the response.)
    ```console
    $ curl -iX POST 'http://localhost:8080/api/v1/workspaces/c16f3be9-413c-406a-89b7-ea463950780e/projects/e9a94c62-77a4-480b-ae4e-33307a5a600b/outputs'
    ```
    ![Project outputs section]({{ site.baseurl }}/assets/images/api-workflow/19-project-outputs-section.png)
    ![Start transformation]({{ site.baseurl }}/assets/images/api-workflow/20-start-transformation.png)
    ![Start transformation response]({{ site.baseurl }}/assets/images/api-workflow/21-start-transformation-response.png)

1. If we try to get the project output, we will get a 204 response because the transformation is in progress.
    (Note: Replace the workspace, project and output UUIDs in the URL with the `id`s you got earlier)
    ```console
    $ curl -i 'http://localhost:8080/api/v1/workspaces/c16f3be9-413c-406a-89b7-ea463950780e/projects/e9a94c62-77a4-480b-ae4e-33307a5a600b/outputs/ae4435e5-9506-419e-a38b-0a2692d41209' \
        -H 'accept: application/octet-stream'
    ```

    ![Get project output]({{ site.baseurl }}/assets/images/api-workflow/22-get-project-output.png)
    ![Get project output response]({{ site.baseurl }}/assets/images/api-workflow/23-get-project-output-response.png)

1. Now scroll down to the QA section. During the transformation Move2Kube will ask some questions that we need to answer.
These 2 endpoints provide us a way to retrieve the current question and provide an answer to it. (Note: An alternative to answering questions
interatively like this is to create a project input with type `config` that contains the answers to those questions.
You can use the `m2kconfig.yaml` from a previous transformation.)

    ![QA section]({{ site.baseurl }}/assets/images/api-workflow/24-qa-section.png)

1. Get the current question
    ```console
    $ curl -i 'http://localhost:8080/api/v1/workspaces/c16f3be9-413c-406a-89b7-ea463950780e/projects/e9a94c62-77a4-480b-ae4e-33307a5a600b/outputs/ae4435e5-9506-419e-a38b-0a2692d41209/problems/current'
    ```

    ![Get the current question]({{ site.baseurl }}/assets/images/api-workflow/25-get-current-question.png)
    ![Get the current question response]({{ site.baseurl }}/assets/images/api-workflow/26-get-current-question-response.png)

1. Post the answer to the current question. We get a 204 response indicating that the answer was valid.
(Note: The answer is part of an object which is encoded to JSON and then escaped and stored in the `solution` field as a JSON string.)
    ```console
    $ curl -iX POST 'http://localhost:8080/api/v1/workspaces/c16f3be9-413c-406a-89b7-ea463950780e/projects/e9a94c62-77a4-480b-ae4e-33307a5a600b/outputs/ae4435e5-9506-419e-a38b-0a2692d41209/problems/current/solution' \
        -H 'Content-Type: application/json' \
        -d '{"solution": "{\"id\":\"move2kube.transformerselector\",\"answer\":\"\"}"}'
    ```
    ![Post answer to question]({{ site.baseurl }}/assets/images/api-workflow/27-post-answer-to-question.png)
    ![Post answer to question response]({{ site.baseurl }}/assets/images/api-workflow/28-post-answer-to-question-response.png)

1. Repeat the above 2 steps until we answer all the questions. Soon we will start getting a different response status code indicating that all the questions have been answered.

1. We can go to the Project outputs section and download the output once the transformation finishes.
    ```console
    $ curl -i 'http://localhost:8080/api/v1/workspaces/c16f3be9-413c-406a-89b7-ea463950780e/projects/e9a94c62-77a4-480b-ae4e-33307a5a600b/outputs/ae4435e5-9506-419e-a38b-0a2692d41209' \
        -H 'accept: application/octet-stream'
    ```
    Extract the downloaded archive to get the outputs generated by Move2Kube.

1. We can start more transformations now and give different input files/answers if necessary. (Note: if we change the project inputs, then we need do
the planning again before we can do another transformation.)
