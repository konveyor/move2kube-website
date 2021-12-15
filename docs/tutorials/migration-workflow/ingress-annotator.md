---
layout: default
title: "Ingress annotator"
permalink: /tutorials/migration-workflow/ingress-annotator
parent: "Migration workflow"
grand_parent: Tutorials
nav_order: 7
---

# Ingress Annotator

## Big picture

In this example, we illustrate how we could add an annotation to the Ingress to change its behavior such as making use of a specific ingress class. 

1. Let us start by creating a workspace directory `WORKSPACE_DIR`. We will assume all commands are run within this workspace and all sub-directories are created within this workspace.

2. To dump the input at an accessible location, create an input sub-directory `input` and copy the `e2e-demo` into this folder.

3. To see what we get **without** any customization, let us run `move2kube transform -s input/ --qa-skip`. The output ingress does not have any annotation and looks like this:
```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  creationTimestamp: null
  labels:
    move2kube.konveyor.io/service: myproject
  name: myproject
```

Let us say, we want to change the helm-charts to be generated per service instead of having a consolidate helm-chart. This can be achieved by customizing Move2Kube using custom transformer that is available in [here](https://github.com/konveyor/move2kube-transformers/tree/main/add-annotation-simple).

4. To use this custom transformer, create a `customizations` sub-directory and copy the transformer from [here](https://github.com/konveyor/move2kube-transformers/tree/main/add-annotation-simple) into this folder.

5. Run the following CLI command: `move2kube transform -s input/ -c customizations/ --qa-skip`. Note that this command has a `-c customizations/` option which is meant to tell Move2Kube to pick up the custom transformer. 

Once the output is generated, we can observe from the below snippet of the ingress file (`deploy/yamls-parameterized/helm-chart/myproject/templates/myproject-ingress.yaml`) that there is an annotation for the ingress class added (`kubernetes.io/ingress.class: haproxy`):
```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: haproxy
  creationTimestamp: null
  labels:
    move2kube.konveyor.io/service: myproject
  name: myproject
```

## Anatomy of ingress annotator transformer
This custom transformer is uses a starlark script (`ingress-annotator.star`) which adds the annotation to the ingress yaml and a configuration yaml (`ingress-annotator.yaml`). The contents of custom transformer are as shown below:
```
add-annotation-simple/
├── ingress-annotator.star
└── ingress-annotator.yaml
```
The configuration yaml consumes and produces kubernetes yaml as shown in the `consumes` and `produces` section.
```
apiVersion: move2kube.konveyor.io/v1alpha1
kind: Transformer
metadata:
  name: IngressAnnotator
  labels: 
    move2kube.konveyor.io/inbuilt: false
spec:
  class: "Starlark"
  consumes:
    KubernetesYamls: 
      merge: false
      mode: "MandatoryPassThrough"
  produces:
    KubernetesYamls:
      disabled: false
  config:
    starFile: "ingress-annotator.star"
```

The code of the starlark script is shown below. At a high-level, the code requires only the `transform()` function as it acts upon any kubernetes yaml generated within Move2Kube. The `transform()` function loops through every yaml generated for every detected service, checks whether it is an ingress yaml, and if so adds the annotation. The path mappings are meant to persist these changes.
```
{% raw %} 
def transform(new_artifacts, old_artifacts):
    pathMappings = []
    artifacts = []

    for v in new_artifacts:
        yamlsPath = v["paths"]["KubernetesYamls"][0]
        serviceName = v["name"]
        v["artifact"] = "KubernetesYamls"
        artifacts.append(v)
        fileList = fs.readdir(yamlsPath)
        yamlsBasePath = yamlsPath.split("/")[-1]
        # Create a path template for the service
        pathTemplateName = serviceName.replace("-", "") + yamlsBasePath
        tplPathData = {'PathTemplateName': pathTemplateName}
        pathMappings.append({'type': 'PathTemplate', \
                            'sourcePath': "{{ OutputRel \"" + yamlsPath + "\" }}", \
                            'templateConfig': tplPathData})
        for f in fileList:
            filePath = fs.pathjoin(yamlsPath, f)
            s = fs.read(filePath)
            yamlData = yaml.loads(s)
            if yamlData['kind'] != 'Ingress':
                continue
            if 'annotations' not in yamlData['metadata']:
                yamlData['metadata']['annotations'] = {'kubernetes.io/ingress.class': 'haproxy'}
            else:
                yamlData['metadata']['annotations']['kubernetes.io/ingress.class'] = 'haproxy'
            s = yaml.dumps(yamlData)
            fs.write(filePath, s)
            pathMappings.append({'type': 'Default', \
                    'sourcePath': yamlsPath, \
                    'destinationPath': "{{ ." + pathTemplateName + " }}"})
        
    return {'pathMappings': pathMappings, 'artifacts': artifacts}
{% endraw %}
```
