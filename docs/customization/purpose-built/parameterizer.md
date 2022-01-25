---
layout: default
title: Parameterizer
permalink: /customization/purpose-built/parameterizer
grand_parent: Customization
parent: "Purpose Built"
nav_order: 1
---

# Parameterizer

[Source code](https://github.com/konveyor/move2kube/blob/39ef793031c2990a0c1f588d85c4237655a49653/transformer/kubernetes/parameterizer/types.go#L43-L91)
[Tutorial](/tutorials/customizing-the-output/custom-parameterization-of-helm-charts-kustomize-octemplates)

## Syntax for parameterizing specific fields


Move2Kube provides a way to parameterize any field in the Kubernetes YAML files, Helm charts and Openshift Templates that Move2Kube generates.
It can also parameterize fields in Kubernetes YAMLs found in the source directory.

In order to parameterize a specific field we need to use a custom transformer. This just means we need to create a directory with some YAML files inside it.
Below we will look at an [example parameterizer](https://github.com/konveyor/move2kube-transformers/blob/main/custom-helm-kustomize-octemplates-parameterization) in detail:
```console
$ ls
README.md deployment-parameterizers.yaml parameterizers.yaml
```

Let's look at the [deployment-parameterizers.yaml](https://github.com/konveyor/move2kube-transformers/blob/main/custom-helm-kustomize-octemplates-parameterization/deployment-parameterizers.yaml) to understand the syntax

```yaml
apiVersion: move2kube.konveyor.io/v1alpha1
kind: Parameterizer
metadata:
  name: deployment-parameterizers
spec:
  parameterizers:
    - target: "spec.replicas"
      template: "${common.replicas}"
      default: 10
      filters:
        - kind: Deployment
          apiVersion: ".*/v1.*"
Now the `values.yaml` looks like this
    - target: 'spec.template.spec.containers.[containerName:name].image'
      template: '${imageregistry.url}/${imageregistry.namespace}/${services.$(metadataName).containers.$(containerName).image.name}:${services.$(metadataName).containers.$(containerName).image.tag}'
      default: quay.io/konveyor/myimage:latest
      filters:
        - kind: Deployment
          apiVersion: ".*/v1.*"
      parameters:
        - name: services.$(metadataName).containers.$(containerName).image.name
          values:
          - envs: [dev, staging, prod]
            metadataName: frontend
            value: frontend
          - envs: [prod]
            metadataName: orders
            value: orders
            custom:
              containerName: orders
```

We see the parameterizer YAML follows the same conventions as Kubernetes YAMLs do.

- `apiVersion` : `string` - This is the version of Move2Kube API we are using. This is fixed at `move2kube.konveyor.io/v1alpha1` for now.
- `kind` : `string` - This tells Move2Kube the type of the YAML file. In this case it's fixed at `Parameterizer`.
- `metadata` : `object`
    - `name` : `string` - The name of the parameterizer.
- `spec` : `object`
    - `parameterizers` : `array[object]` - A list of parameterizer objects.
        - `target` : `string` - This is where we put the field we want to parameterize. The syntax is same as `yq` dot notation. We will explain this is in more detail in a later section.
        - `template` : `string` - This is where we specify how the field should get its value. For example: `"${common.replicas}"` here means in the Helm chart that Move2Kube generates, inside the `values.yaml` there is a field under `common` and inside it `replicas` as shown below.
            ```console
            $ cat values.yaml
            ```
            ```yaml
            common:
                replicas: 10
            ```
            The value of this field will be the same as the value in the original YAML, but we can override it using the `default` parameter.
        - `default` : `any` - This can be used to override the default value for the field that we are parameterizing. For example: if the original value of `spec.replicas` was `2`, then the `values.yaml` would look like the below
            ```console
            $ cat values.yaml
            ```
            ```yaml
            common:
                replicas: 2
            ```
            If we wanted a different value like `10` then we can specify `default: 10` in the parameterizer YAML and now the `values.yaml` looks like this
            ```console
            $ cat values.yaml
            ```
            ```yaml
            common:
                replicas: 10
            ```
        - `filters` : `array[object]` - This can be used to filter the Kubernetes YAML files that we want to target.
            - `kind` : `string` - Only parameterize Kubernetes YAMLs that match this `kind` field. We can specify a regex if we want to match multiple kinds.
              `apiVersion` : `string` - Only parameterize Kubernetes YAMLs that match this `apiVersion` field. We can specify a regex here as well.
              `name` : `string` - Only parameterize Kubernetes YAMLs that have the same `metadata.name` field. We can specify a regex here as well.
              `envs` : `array[string]` - Only apply this parameterization when targetting one of the environments listed here.
        - `parameters` : `array[object]` - This can be used to specify defaults for each parameter inside the `template`.
            - `name` : `string` - Name of a parameter inside the `template`.
            - `default` : `string` - The default value for this parameter.

## Template parameter

When we parameterize a specific a field in a Kubernetes YAML, we may want to templatize in different ways.
If we don't specify the `template` parameter, it will default to the `target` parameter.

### Example 1

For example: `target: "spec.replicas"` would cause the `spec.replicas` to be parameterized (probably in Deployment YAMLs).
Move2Kube would parameterize it under the key `<kind>.<apiVersion>.<metadata.name>.spec.replicas` and the `values.yaml` would look like this
```yaml
Deployment:
    v1:
        myDeploymentName:
            spec:
                replicas: 2
```
where `myDeploymentName` is the `metadata.name` field in the Deployment YAML and `2` is the original value for `spec.replicas` from the YAML file.

By specifying `template: "${common.replicas}"` we override the default key and now Move2Kube puts the following in the `values.yaml`
```yaml
common:
    replicas: 2
```

By specifying `default: 10` we override the default value and now Move2Kube puts the following in the `values.yaml`
```yaml
common:
    replicas: 10
```

### Example 2

Now let's look at a more complicated scenario. Let's say we are parameterizing the image name of some container in a Deployment YAML.
First of all, since the `containers` field in the Deployment YAML is a list, we need to use the syntax `[<index>]` to parameterize a single element in the list.

We can use `target: "spec.template.spec.containers.[0].image"` to parameterize the first container in the Deployment.
The `values.yaml` looks like this
```yaml
Deployment:
    v1:
        myDeploymentName:
            spec:
                template:
                    spec:
                        containers:
                            - image: 'my-repo.com/my-namespace/my-image-name:my-image-tag'
```

This may however not be enough. We may want to parameterize the container image registry url, registry namespace, image name and image tag separately.
For this we can use
```yaml
template: '${imageregistry.url}/${imageregistry.namespace}/${containers.[0].image.name}:${containers.[0].image.tag}'
```
This will cause the `values.yaml` to look like this:
```yaml
imageregistry:
    url: 'my-repo.com'
    namespace: 'my-namespace'
containers:
    - image:
        name: 'my-image-name'
        tag: 'my-image-tag'
```
and the Helm template will look like this
```yaml
{% raw %}
spec:
    template:
        spec:
            containers:
                - image: '{{ index .Values "imageregistry" "url" }}/{{ index .Values "imageregistry" "namespace" }}/{{ index .Values "containers" "[0]" "image" "name" }}:{{ index .Values "containers" "[0]" "image" "tag" }}'
{% endraw %}
```

### Example 3

Now let's look at an even more complicated scenario. Continuing from example 2, we might want to have a dynamic key in our `values.yaml`.
To do this we can use the `[]` square brackets and `$` dollar sign syntax:
```yaml
target: 'spec.template.spec.containers.[containerName:name].image'
template: '${imageregistry.url}/${imageregistry.namespace}/${containers.$(containerName).image.name}:${containers.$(containerName).image.tag}'
```
Here `[containerName:name]` in `target` tells Move2Kube to extract the `name` field from the `container` object in the Deployment YAML and make it available as `containerName`.
The `$(containerName)` in `template` gets replaced by the `name` that was extracted.

The `values.yaml` looks like this:
```yaml
imageregistry:
    url: 'my-repo.com'
    namespace: 'my-namespace'
containers:
    myContainerName1:
        image:
            name: 'my-image-name'
            tag: 'my-image-tag'
    myContainerName2:
        image:
            name: 'my-image-name-2'
            tag: 'my-image-tag-2'
```

This gives us very powerful way to parameterize the image name of containers. We can simultaneously have a common registry url and namespace for all the images while also parameterizing the image name and tag for each container separately.
