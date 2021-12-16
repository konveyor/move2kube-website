---
layout: default
title: "Custom helm-chart generator"
permalink: /tutorials/migration-workflow/custom-helmchart-gen
parent: "Migration workflow"
grand_parent: Tutorials
nav_order: 8
---

# Custom helm-chart generator

## Big picture

In this example, we illustrate how we could generate our own custom helm-chart while still using Move2Kube for filling in the discovered service configurations from the source artifacts. 

1. Let us start by creating a workspace directory `WORKSPACE_DIR`. We will assume all commands are run within this workspace and all sub-directories are created within this workspace.

2. To dump the input at an accessible location, create an input sub-directory `input` and copy the `e2e-demo` into this folder.

3. To see what we get **without** any customization, let us run `move2kube transform -s input/ --qa-skip`. The output helm-chart looks like this and is consolidate across all services discovered in `e2e-demo`:
```
myproject/deploy/yamls-parameterized/
├── helm-chart
│   └── myproject
│       ├── Chart.yaml
│       └── templates
│           ├── config-utils-deployment.yaml
│           ├── config-utils-service.yaml
│           ├── customers-tomcat-deployment.yaml
│           ├── customers-tomcat-service.yaml
│           ├── frontend-deployment.yaml
│           ├── frontend-service.yaml
│           ├── gateway-deployment.yaml
│           ├── gateway-service.yaml
│           ├── inventory-deployment.yaml
│           ├── inventory-service.yaml
│           ├── myproject-ingress.yaml
│           ├── orders-deployment.yaml
│           └── orders-service.yaml
```

Let us say, we want to change the helm-charts to be generated per service instead of having a consolidate helm-chart. This can be achieved by customizing Move2Kube using custom transformer that is available in [here](https://github.com/konveyor/move2kube-transformers/tree/main/custom-helmchart-gen).

4. To use this custom transformer, create a `customizations` sub-directory and copy the `custom-helmchart-gen` from [here](https://github.com/konveyor/move2kube-transformers/tree/main/custom-helmchart-gen) into this folder.

5. Run the following CLI command: `move2kube transform -s input/ -c customizations/ --qa-skip`. Note that this command has a `-c customizations/` option which is meant to tell Move2Kube to pick up the custom transformer `custom-helmchart-gen`. 

Once the output is generated, we can observe one helm-chart is generated for each service unlike the un-customized case where the helm-chart was a consolidated over all services. Also, note that every helm-chart project is named after the service it is meant for. The contents are shown below for reference:
```
myproject/e2e-demo/
├── config-utils
│   ├── helm-chart
│   │   └── config-utils
│   │       ├── Chart.yaml
│   │       ├── templates
│   │       └── values.yaml
│   ├── pom.xml
│   └── src
│       └── main
│           └── java
├── customers-tomcat-k8s
│   ├── Dockerfile
│   ├── Makefile
│   ├── helm
│   │   ├── java-backend
│   │   │   ├── Chart.lock
│   │   │   ├── Chart.yaml
│   │   │   ├── charts
│   │   │   ├── config
│   │   │   ├── secret
│   │   │   ├── templates
│   │   │   └── values.yaml
│   │   └── values.yaml
│   ├── helm-chart
│   │   └── customers-tomcat
│   │       ├── Chart.yaml
│   │       ├── templates
│   │       └── values.yaml
│   ├── pom.xml
│   └── src
│       └── main
│           ├── java
│           └── resources
├── gateway
│   ├── Dockerfile
│   ├── config
│   │   ├── Chart.lock
│   │   ├── Chart.yaml
│   │   ├── config
│   │   │   └── application.yaml
│   │   ├── secret
│   │   │   └── application.yaml
│   │   ├── templates
│   │   │   ├── configmap.yaml
│   │   │   └── secret.yaml
│   │   └── values.yaml
│   ├── helm
│   │   ├── ingress.yaml
│   │   ├── java-backend
│   │   │   ├── Chart.yaml
│   │   │   ├── config
│   │   │   ├── secret
│   │   │   ├── templates
│   │   │   └── values.yaml
│   │   └── values.yaml
│   ├── helm-chart
│   │   └── snowdrop-dependencies
│   │       ├── Chart.yaml
│   │       ├── templates
│   │       └── values.yaml
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   └── resources
│       └── test
│           ├── java
│           └── resources
└── inventory
    ├── Dockerfile
    ├── README.md
    ├── config
    │   ├── Chart.lock
    │   ├── Chart.yaml
    │   ├── config
    │   │   └── application.yaml
    │   ├── secret
    │   │   └── application.yaml
    │   ├── templates
    │   │   ├── configmap.yaml
    │   │   └── secret.yaml
    │   └── values.yaml
    ├── helm
    │   ├── README.md
    │   ├── java-backend
    │   │   ├── Chart.lock
    │   │   ├── Chart.yaml
    │   │   ├── charts
    │   │   ├── config
    │   │   ├── secret
    │   │   ├── templates
    │   │   └── values.yaml
    │   └── values.yaml
    ├── helm-chart
    │   └── inventory
    │       ├── Chart.yaml
    │       ├── templates
    │       └── values.yaml
    ├── mvnw
    ├── mvnw.cmd
    ├── pom.xml
    └── src
        ├── main
        │   ├── docker
        │   ├── java
        │   └── resources
        └── test
            └── java
```

## Anatomy of `custom-helmchart-gen` transformer
This custom transformer is more advanced compared to the previous cases as it uses a starlark script (`customhelmchartgen.star`) and several templatization features (notice the `{% raw %}{{\ .ServiceName\ }}{% endraw %}` template in the file names of custom helm-chart template in the `templates` sub-directory) to achieve the per-service helm-chart requirement. Also, this `custom-helmchart-gen` transformer is generating a custom dockerfile for any Java service detected within `e2e-demo` project. The contents of `custom-helmchart-gen` custom transformer are as shown below:
```
{% raw %} 
customization/custom-helmchart-gen/
├── customhelmchartgen.star
├── customhelmchartgen.yaml
└── templates
    └── helm-chart
        └── {{\ .ServiceName\ }}
            ├── Chart.yaml
            ├── templates
            │   ├── {{\ .ServiceName\ }}-deployment.yaml
            │   ├── {{\ .ServiceName\ }}-ingress.yaml
            │   └── {{\ .ServiceName\ }}-service.yaml
            └── values.yaml
{% endraw %}
```
The code of the starlark script is shown below. At a high level, the custom transformer detects (in the detect phase where `directory_detect()` function is invoked) a Java project if it finds `pom.xml` in the directory. Once the Java project is detected, the corresponding project path and service name are passed to the transform phase through Move2Kube. In the transform phase, the `transform()` function is invoked with the discovered service artifacts (from detect phase). These artifacts are used to fill the helm-chart templates shown above and produced as the output in a per-service folder structure.

```python
{% raw %}PomFile = "pom.xml"

# Performs the detection of pom file and extracts service name
def directory_detect(dir):
    dataFilePath = fs.pathjoin(dir, PomFile)
    # Check for the presence of a pom.xml file. If so, it is a Java service
    if fs.exists(dataFilePath):
        # Extract the service name from the pom.xml
        serviceName = getServiceName(dataFilePath)
        # Create a service artifact with the project path and return it to Move2Kube.
        # This artifact will be passed to the transform() function below.
        return  {serviceName: [{
                    "paths": {"ProjectPath": [dir]} }] }

# Creates the customized helm chart for every service
def transform(new_artifacts, old_artifacts):
    pathMappings = []
    artifacts = []
    # Path template used for creating per-service helm-charts
    pathTemplate = "{{ SourceRel .ServiceFsPath }}"
    for v in new_artifacts:
        serviceName = v["name"]
        dir = v['paths']['ProjectPath'][0]
        # Create a path template for the service
        pathTemplateName = serviceName.replace("-", "") + 'path'
        tplPathData = {'ServiceFsPath': dir, 'PathTemplateName': pathTemplateName}
        # Evaluate the path templates
        pathMappings.append({'type': 'PathTemplate', \
                            'sourcePath': pathTemplate, \
                            'templateConfig': tplPathData})
        pathMappings.append({'type': 'SpecialTemplate', \
                    'destinationPath': "{{ ." + pathTemplateName + " }}", \
                    'templateConfig': {'ServiceFsPath': dir, 'ServiceName': serviceName}})
        pathMappings.append({'type': 'Source', \
                    'sourcePath': "{{ ." + pathTemplateName + " }}",
                    'destinationPath': "{{ ." + pathTemplateName + " }}"})

    return {'pathMappings': pathMappings, 'artifacts': artifacts}

# Extracts service name from pom file
def getServiceName(filePath):
    data = fs.read(filePath)
    lines = data.splitlines()
    for l in lines:
        if 'artifactId' in l:
            t = l.split('>')
            t2 = t[1].split('<')
            return t2[0]
{% endraw %}
```
