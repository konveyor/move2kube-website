---
layout: default
title: "External transformer illustration"
permalink: /tutorials/customizing-the-output/external-transformer-illustration
parent: "Customizing the output"
grand_parent: Tutorials
nav_order: 4
---

# External transformer illustration
The custom transformer used in this case is the same as `add-custom-files-directories-in-custom-locations`. We will use the same case to describe the usefulness of external transformers.

Move2Kube allows defining containerized or native transformers where-in the `directory_detect` and `transform` operations are external scripts residing within the container or natively that are invoked by Move2Kube (Checkout the external transform description [here](/transformers/external/executable)).


1. Let us start by creating an empty workspace directory say `workspace` and make it the current working directory. We will assume all commands are executed within this directory.
    ```console
    $ mkdir workspace && cd workspace
    ```

1. Lets use the [enterprise-app](https://github.com/konveyor/move2kube-demos/tree/main/samples/enterprise-app) as input for this flow.
    ```console
    $ curl https://move2kube.konveyor.io/scripts/download.sh | bash -s -- -d samples/enterprise-app/src -r move2kube-demos  
    $ ls src
    README.md		config-utils		customers	docs			frontend		gateway			orders
    ```
    In this project, all the apps have a pom.xml file. Lets use a custom transformer to put a helm chart created out of a template into each of those project directories.

1. We will use the external transformer which is [native](https://github.com/konveyor/move2kube-transformers/tree/main/native-external-transformer) or [containerized](https://github.com/konveyor/move2kube-transformers/tree/main/containerized-external-transformer). We copy it into the `customizations` sub-directory.
    ```console
    $ curl https://move2kube.konveyor.io/scripts/download.sh | bash -s -- -d native-external-transformer -r move2kube-transformers -o customizations
    ```
    OR
    ```console
    $ curl https://move2kube.konveyor.io/scripts/download.sh | bash -s -- -d containerized-external-transformer -r move2kube-transformers -o customizations
    ```
1. Now lets transform with this customization. Specify the customization using the `-c` flag. 
    ```console
    $ move2kube transform -s src/ -c customizations/
    ``` 
    You could hit ENTER for all questions so that the default answer is picked by Move2Kube. Only for below questions, provide `Y` as input for the following question in the QA flow:
    ```
    ? Allow spawning containers?
    ID: move2kube.spawncontainers
    Hints:
    - If this setting is set to false, those transformers that rely on containers will not work.

    (y/N) 
    ```
Once the output is generated, we can observe one helm-chart is generated for each service and placed within the service directory. Also, note that every helm-chart project is named after the service it is meant for. The contents are shown below for reference:
```
{% raw %}
    myproject
    ├── config-utils
    │   ├── config-utils-helmchart
    │   ├── pom.xml
    │   └── src
    ├── customers
    │   ├── Makefile
    │   ├── README.md
    │   ├── customers-helmchart
    │   ├── mvnw
    │   ├── mvnw.cmd
    │   ├── pom.xml
    │   └── src
    ├── gateway
    │   ├── gateway-helmchart
    │   ├── manifest.yml
    │   ├── mvnw
    │   ├── mvnw.cmd
    │   ├── pom.xml
    │   └── src
    └── orders
        ├── README.md
        ├── manifest.yml
        ├── mvnw
        ├── mvnw.cmd
        ├── orders-helmchart
        ├── pom.xml
        └── src
  {% endraw %}
```