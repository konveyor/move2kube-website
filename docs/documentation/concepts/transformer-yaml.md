---
layout: default
title: "Transformer YAML"
permalink: /documentation/concepts/transformer-yaml
parent: Concepts
grand_parent: Documentation
nav_order: 4
---

# Transformer YAML

[Example built-in transformer YAMLs](https://github.com/konveyor/move2kube/tree/dcf8793a889c0a8f9f4423e9e9ee3a95003c6bcc/assets/inbuilt/transformers)

[Source code](https://github.com/konveyor/move2kube/blob/6448624d79c37809417c05e34fcb3b2456952bcb/types/transformer/transformer.go#L27-L49)

```golang
// Transformer defines definition of cf runtime instance apps file
type Transformer struct {
	types.TypeMeta   `yaml:",inline" json:",inline"`
	types.ObjectMeta `yaml:"metadata,omitempty" json:"metadata,omitempty"`
	Spec             TransformerSpec `yaml:"spec,omitempty" json:"spec,omitempty"`
}

// TransformerSpec stores the data
type TransformerSpec struct {
	FilePath           string                                 `yaml:"-" json:"-"`
	Class              string                                 `yaml:"class" json:"class"`
	Isolated           bool                                   `yaml:"isolated" json:"isolated"`
	DirectoryDetect    DirectoryDetect                        `yaml:"directoryDetect" json:"directoryDetect"`
	ExternalFiles      map[string]string                      `yaml:"externalFiles" json:"externalFiles"` // [source]destination
	ConsumedArtifacts  map[ArtifactType]ArtifactProcessConfig `yaml:"consumes" json:"consumes"`
	ProducedArtifacts  map[ArtifactType]ProducedArtifact      `yaml:"produces" json:"produces"`
	Dependency         interface{}                            `yaml:"dependency" json:"dependency"` // metav1.LabelSelector
	Override           interface{}                            `yaml:"override" json:"override"`     // metav1.LabelSelector
	DependencySelector labels.Selector                        `yaml:"-" json:"-"`
	OverrideSelector   labels.Selector                        `yaml:"-" json:"-"`
	TemplatesDir       string                                 `yaml:"templates" json:"templates"` // Relative to yaml directory or working directory in image
	Config             interface{}                            `yaml:"config" json:"config"`
}
```

This page explains format of the transformer YAML file. If you are not familiar with the YAML format then here's a quick tutorial [https://www.redhat.com/en/topics/automation/what-is-yaml](https://www.redhat.com/en/topics/automation/what-is-yaml)   
Below we have the details of each field in the YAML. The `apiVersion` and `kind` are necessary to tell Move2Kube that this is a transformer.

- `apiVersion` : `string` - Similar to Kubernetes apiVersion strings. This should be `move2kube.konveyor.io/v1alpha1` for now.
- `kind` : `string` - The type of resource contained in this YAML file. This should be `Transformer` for transformers.
- `metadata` : `object` - This section tells Move2Kube the name of the transformer. It also allows us to set some optional labels that can be used to enable or disable the transformer.
	- `name` : `string` - Name of your transformer.
	- `labels` : `object ([string]: string)` - This is a set of labels similar to Kubernetes. It can be used to enable/disable set of transformers during both planning and tranformation phases.
		For more details run the `move2kube help transform` command.
- `spec` : `object` - This section contains the main data about the transformer.
	- `class` : `string` - This the type of the transformer. Examples are: `BuildConfig`, `Knative`, `Kubernetes`, `Parameterizer`, `Tekton`, `GolangDockerfileGenerator`, etc.
	- `isolated` : `boolean` - If true the transformer will get a full unmodified copy of the source directory. By default transformers don't run in isolation. They get a temporary directory containing a copy of the source directory, that has already been used by other transformers. So if other transformers have created some temporary files, all of those files will be visible to your transformer. Running in isolation increases the run time of your transformer but makes writing transformers easier since you don't need to worry about cleaning up after your transformer has finished.
	- `directoryDetect` : `object` - This can be used to control what directories your transformer is run on during the planning phase.
		- `levels` : `int` - Supported values are:
			- `-1` Run on the source directory and all of its sub-directories.
			- `0` Skip directory detect entirely. Does not run on any directories.
			- `1` Run on just the source directory, not on any of its sub-directories.
	- `externalFiles` : `object ([string]: string)` - TODO
	- `consumes` : `object ([string]: object)` - This can be used to narrow down the artifacts that your transformer runs on during the transformation phase.
		The key is a string containing the type of the artifact. The value is an object with the following fields:
		- `merge` : `boolean` - If true all artifacts of this type will be merged into a single one before being passed to your transformer.
	- `produces` : `object ([string]: object)` - This can be used to tell Move2Kube the type of output artifacts your transformer will return.
		The key is a string containing the type of the artifact. The value is an object with the following fields:
		- `changeTypeTo` : `string` - This can be used to change the artifact type to something else. Useful for overriding the behavior of existing transformers.
	- `dependency` : `any` - TODO
	- `override` : `any` - TODO
	- `templates` : `string` - TODO
	- `config` : `any` - Each transformer has a type/class specified by the `class` field shown above. Each class exposes certain configuration options.
		All such options can be configured here. For more details refer to the documentation for the transformer class that you are using.
		Example: [assets/inbuilt/transformers/kubernetes/parameterizers/parameterizers.yaml#L14-L18](https://github.com/konveyor/move2kube/blob/dcf8793a889c0a8f9f4423e9e9ee3a95003c6bcc/assets/inbuilt/transformers/kubernetes/parameterizers/parameterizers.yaml#L14-L18)
