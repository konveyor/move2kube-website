---
layout: default
title: "Adding custom annotations to Kubernetes YAMLs"
permalink: /tutorials/customizing-the-output/custom-annotations/
parent: "Customizing the output"
grand_parent: Tutorials
nav_order: 2
---

# Adding custom annotations to Kubernetes YAMLs

## Big picture

Move2Kube generates Kubernetes yamls based on the needs of the application. But there might be situations where you might require specific fields to look different in the output. In this example, we illustrate how we could add an annotation to the Ingress YAML specifying an ingress class. 

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

3. Let's first run Move2Kube **without** any customization. The output ingress does not have any annotation. Once done, lets delete the `myproject` directory.
  ```console
      $ move2kube transform -s src/ --qa-skip && cat myproject/deploy/yamls/myproject-ingress.yaml && rm -rf myproject
      apiVersion: networking.k8s.io/v1
      kind: Ingress
      metadata:
        creationTimestamp: null
        labels:
          move2kube.konveyor.io/service: myproject
        name: myproject
  ```

4. We will use the starlark based custom transformer [here](https://github.com/konveyor/move2kube-transformers/tree/main/add-custom-kubernetes-annotation). We copy it into the `customizations` sub-directory.
  ```console
      $ curl https://move2kube.konveyor.io/scripts/download.sh | bash -s -- -d add-custom-kubernetes-annotation -r move2kube-transformers -o customizations
  ```

5. Now lets transform with this customization. Specify the customization using the `-c` flag. 
  ```console
      $ move2kube transform -s src/ -c customizations/ --qa-skip
  ```

Once the output is generated, we can observe from the below snippet of the ingress file (`myproject/deploy/yamls/myproject-ingress.yaml`) that there is an annotation for the ingress class added (`kubernetes.io/ingress.class: haproxy`):
  ```console
      $ cat myproject/deploy/yamls/myproject-ingress.yaml
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
This custom transformer uses a configuration yaml (`ingress-annotator.yaml`) and a starlark script (`ingress-annotator.star`) which adds the annotation to the ingress yaml. The contents of custom transformer are as shown below:
  ```console
      $ ls customizations/add-custom-kubernetes-annotation
      ingress-annotator.star  ingress-annotator.yaml
  ```
The configuration yaml specifies that the custom transformer consumes and produces kubernetes yaml artifact type as shown in the `consumes` and `produces` section.
  ```console
      $ cat customizations/add-custom-kubernetes-annotation/ingress-annotator.yaml
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
            # Ensures a artifact of this type gets immediately intercepted by this transformer
            mode: "MandatoryPassThrough" 
        produces:
          KubernetesYamls:
            disabled: false
        config:
          starFile: "ingress-annotator.star"
  ```

The code of the starlark script is shown below. At a high-level, the code requires only the `transform()` function as it acts upon any kubernetes yaml generated within Move2Kube. The `transform()` function loops through every yaml generated for every detected service, checks whether it is an ingress yaml, and if so adds the annotation. The path mappings are meant to persist these changes.
  ```console
      $ cat customizations/add-custom-kubernetes-annotation/ingress-annotator.star
      {% raw %} 
      def transform(new_artifacts, old_artifacts):
          pathMappings = []
          artifacts = []

          for a in new_artifacts:
              yamlsPath = a["paths"]["KubernetesYamls"][0]
              serviceName = a["name"]
              artifacts.append(a)

              fileList = fs.readdir(yamlsPath)
              yamlsBasePath = yamlsPath.split("/")[-1]
              # Create a custom path template for the service, whose values gets filled and can be used in other pathmappings
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

The above steps can be replicated in the UI, by uploading the zip of the custom transformer as a `customization`. You can get the zip of the source and customization by adding a `-z` to the end of the commands used in step 2 and step 4.

Next step [Parameterizing custom fields in Helm Chart, Kustomize, OC Templates](/tutorials/customizing-the-output/custom-parameterization-of-helm-charts-kustomize-octemplates)
