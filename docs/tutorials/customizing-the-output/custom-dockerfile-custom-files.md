---
layout: default
title: "Adding custom Dockerfile or any custom file"
permalink: /tutorials/customizing-the-output/custom-dockerfile-custom-files
parent: "Customizing the output"
grand_parent: Tutorials
nav_order: 2
---

# Creating custom Dockerfile

## Big picture

In this example, we look at how to make Move2Kube add custom Dockerfile and a custom file. 

1. Let us start by creating an empty workspace directory say `workspace` and make it the current working directory. We will assume all commands are executed within this directory.

  ```console
      $ mkdir workspace && cd workspace
  ```

2. Lets use the [enterprise-app](https://github.com/konveyor/move2kube-demos/tree/main/samples/enterprise-app) as input for this flow.

  ```console
      $ curl https://move2kube.konveyor.io/scripts/download.sh | bash -s -- -d samples/enterprise-app/src -r move2kube-demos

      $ ls src
      README.md		config-utils		customers-tomcat	docs			frontend		gateway			orders
  ```

3. Let's first run Move2Kube without any **without** any customization. If we notice the `Dockerfile` generated for the `frontend` app, it uses `registry.access.redhat.com/ubi8/nodejs-12` as base image, and there are no scripts named `start-nodejs.sh`. Once done, lets delete the `myproject` directory.
  ```console
      $ move2kube transform -s src/ --qa-skip && ls myproject/source/frontend && cat myproject/source/frontend/Dockerfile && rm -rf myproject

      Dockerfile		README.md		dr-surge.js		manifest.yml		package-lock.json	server.js		stories			test-setup.js		webpack.common.js	webpack.prod.js LICENSE			__mocks__		jest.config.js		nodemon.json		package.json		src			stylePaths.js		tsconfig.json		webpack.dev.js

      FROM registry.access.redhat.com/ubi8/nodejs-12
      COPY . .
      RUN npm install
      RUN npm run build
      EXPOSE 8080
      CMD npm run start
  ```

Let us say, we want to change the base image `registry.access.redhat.com/ubi8/nodejs-12` provided by Move2Kube, to some custom image, say `quay.io/konveyor/nodejs-12`. This can be achieved by modifying the template used by the Nodejs transformer.

4. We will use a [custom configured version](https://github.com/konveyor/move2kube-transformers/tree/main/custom-dockerfile) of the [nodejs in-built transformer](https://github.com/konveyor/move2kube/tree/main/assets/inbuilt/transformers/dockerfilegenerator/nodejs) to achieve this. We copy [it](https://github.com/konveyor/move2kube-transformers/tree/main/custom-dockerfile-custom-files) into the `customizations` sub-directory.
  ```console
      $ curl https://move2kube.konveyor.io/scripts/download.sh | bash -s -- -d custom-dockerfile-custom-files -r move2kube-transformers -o customizations
  ```

5. Now lets transform with this customization. Specify the customization using the `-c` flag. 
  ```console
      $ move2kube transform -s src/ -c customizations/ --qa-skip
  ```

Once the output is generated, we can observe the Dockerfile generated for the `frontend` app contains the custom base image and also has a new file named `start-nodejs.sh` in the `frontend` directory. 
  ```console
    $ ls myproject/source/frontend
    Dockerfile		README.md		dr-surge.js		manifest.yml		package-lock.json	server.js		start-nodejs.sh		stylePaths.js		tsconfig.json		webpack.dev.js LICENSE			__mocks__		jest.config.js		nodemon.json		package.json		src			stories			test-setup.js		webpack.common.js	webpack.prod.js

    $ cat myproject/source/src/frontend/Dockerfile
    FROM quay.io/konveyor/nodejs-12
    COPY . .
    RUN npm install
    RUN npm run build
    EXPOSE 8080
    CMD sh start-nodejs.sh
  ```

## Anatomy of `custom-dockerfile-custom-files` transformer
Specifically, the `custom-dockerfile-custom-files` transformer is generating a custom dockerfile for any NodeJS apps.
The contents of `custom-dockerfile-custom-files` are as shown below:
  ```console
    $ tree customizations
    customizations/
    └── custom-dockerfile-custom-files
        ├── nodejs.yaml
        └── templates
            ├── Dockerfile
            └── start-nodejs.sh
  ```
To custom configure an in-built transformer, you can copy the [in-built transformer's configuration directory](https://github.com/konveyor/move2kube/tree/main/assets/inbuilt/transformers) from `move2kube` source, change the configurations and use it as a customization.

In this case, we change the Dockerfile template, add a script and change the transformer configuration yaml.

1. To change the template, we have added our custom template in `customizations/custom-dockerfile-custom-files/templates/Dockerfile`. The template is the [same as the one used in the in-built transformer](https://github.com/konveyor/move2kube/blob/main/assets/inbuilt/transformers/dockerfilegenerator/nodejs/templates/Dockerfile), except that we are using a custom base image and a custom `CMD` here.
  ```console
    $ cat customizations/custom-dockerfile/templates/Dockerfile
    FROM quay.io/konveyor/nodejs-12
    COPY . .
    RUN npm install
    {{- if .Build }}
    RUN npm run build
    {{- end}}
    EXPOSE {{ .Port }}
    CMD sh start-nodejs.sh
  ```
2. Add `customizations/custom-dockerfile-custom-files/templates/start-nodejs.sh`.
  ```console
    $ ls customizations/custom-dockerfile-custom-files/templates/
    Dockerfile	start-nodejs.sh
  ```
3. The `nodejs.yaml` is the transformer configuration. We have [two changes](https://github.com/konveyor/move2kube/blob/main/assets/inbuilt/transformers/dockerfilegenerator/nodejs/nodejs.yaml) here compared to the in-built transformer: 
- The name of our custom transformer is `Nodejs-CustomFiles` (see `name` field in the `metadata` section). 
- We are also specifying an `override` section which is asking Move2Kube to disable the transformer named `Nodejs-Dockerfile` if this transformer is present.

  ```console
    $ cat customizations/custom-dockerfile/nodejs.yaml
    apiVersion: move2kube.konveyor.io/v1alpha1
    kind: Transformer
    metadata:
      name: Nodejs-CustomFiles
      labels:
        move2kube.konveyor.io/task: containerization
        move2kube.konveyor.io/inbuilt: true
    spec:
      class: "NodejsDockerfileGenerator"
      directoryDetect:
        levels: -1
      consumes:
        Service: 
          merge: false
      produces:
        Dockerfile:
          disabled: false
        DockerfileForService:
          disabled: false
      override:
        matchLabels: 
          move2kube.konveyor.io/name: Nodejs-Dockerfile
      config:
        defaultNodejsVersion: "12"
  ```

Next step [Parameterizering specific fields in the Helm Chart](/tutorials/customizing-the-output/parameterizer)
