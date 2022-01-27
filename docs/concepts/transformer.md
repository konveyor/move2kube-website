---
layout: default
title: Transformer
permalink: /concepts/transformer
parent: Concepts
nav_order: 1
---

# Transformer

Each transformer consumes [Artifacts](/concepts/artifact) and outputs [Artifacts](/concepts/artifact) and [PathMappings](/concepts/path-mapping). The Artifacts allow multiple transformers to be chained together to achieve a end to end transformation. The PathMappings are used for persisting the changes in the filesystem.

Each transformer generally has its own directory ([built-in transformer](https://github.com/konveyor/move2kube/tree/main/assets/built-in/transformers) or [external transformer](https://github.com/konveyor/move2kube-transformers)) which has all the configuration required for that transformer. The transformer YAML is the most important part of the transformer definition, which specifies its behavior. It also can have `templates` directory for putting template files to be used by the transformer, and other files/configuration that are specific to each transformer.

## Transformer YAML

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

This explains format of the transformer YAML file. If you are not familiar with the YAML format then here's a quick tutorial [https://www.redhat.com/en/topics/automation/what-is-yaml](https://www.redhat.com/en/topics/automation/what-is-yaml)   
Below we have the details of each field in the YAML. The `apiVersion` and `kind` are necessary to tell Move2Kube that this is a transformer.

- `apiVersion` : `string` - Similar to Kubernetes apiVersion strings. This should be `move2kube.konveyor.io/v1alpha1` for now.
- `kind` : `string` - The type of resource contained in this YAML file. This should be `Transformer` for transformers.
- `metadata` : `object` - This section tells Move2Kube the name of the transformer. It also allows us to set some optional labels that can be used to enable or disable the transformer.
	- `name` : `string` - Name of your transformer.
	- `labels` : `object ([string]: string)` - This is a set of labels similar to Kubernetes. It can be used to enable/disable set of transformers during both planning and tranformation phases.
		For more details run the `move2kube help transform` command.
- `spec` : `object` - This section contains the main data about the transformer.
	- `class` : `string` - This is a mandatory field which specifies which Move2Kube internal implementation should be used for this transformer. Examples are: `Kubernetes`, `Parameterizer`, `GolangDockerfileGenerator`, `Executable`, `Starlark`, etc.
	- `isolated` : `boolean` - If true the transformer will get a full unmodified copy of the source directory. By default transformers don't run in isolation. They get a temporary directory containing a copy of the source directory, that has already been used by other transformers. So if other transformers have created some temporary files, all of those files will be visible to your transformer. Running in isolation increases the run time of your transformer but makes writing transformers easier since you don't need to worry about cleaning up after your transformer has finished.
	- `directoryDetect` : `object` - This can be used to control what directories your transformer is run on during the planning phase.
		- `levels` : `int` - Supported values are:
			- `-1` Run on the source directory and all of its sub-directories.
			- `0` Skip directory detect entirely. Does not run on any directories.
			- `1` Run on just the source directory, not on any of its sub-directories.
	- `externalFiles` : `object ([string]: string)` - This can be used to specify files that needs to be copied from [outside the context of this transformer](https://github.com/konveyor/move2kube/blob/023467328100472fc3ff36218af85b10573247f3/assets/built-in/transformers/dockerfilegenerator/java/maven/transformer.yaml#L22-L24) into the transformer. This is helpful to specify files used by multiple transformers in a single location.
	- `consumes` : `object ([string]: object)` - This can be used to narrow down the artifacts that your transformer runs on during the transformation phase.
		The key is a string containing the type of the artifact. The value is an object with the following fields:
		- `merge` : `boolean` - If true all artifacts of this type will be merged into a single one before being passed to your transformer.
	- `produces` : `object ([string]: object)` - This can be used to tell Move2Kube the type of output artifacts your transformer will return.
		The key is a string containing the type of the artifact. The value is an object with the following fields:
		- `changeTypeTo` : `string` - This can be used to change the artifact type to something else. Useful for overriding the behavior of existing transformers.
	- `dependency` : `any` - If the transformer wants the artifacts that are about to be processed by this transformer to be [preprocessed](https://github.com/konveyor/move2kube/blob/023467328100472fc3ff36218af85b10573247f3/assets/built-in/transformers/kubernetes/kubernetes/transformer.yaml#L17-L19) by another transformer, this field can be used to specify the transformer to use for proprocessing. 
	- `override` : `any` - If this transformer overrides the behavior of other transformers, a [selector](https://github.com/konveyor/move2kube-transformers/blob/25db4c2e46bf9795998ba560fa8fb59d72fcd1a8/custom-helm-kustomize-octemplates-parameterization/transformer.yaml#L14-L16) can be specified here to disable those transformers that match the selector. 
	- `templates` : `string` - Specifies the template directory. The default value is `templates`
	- `config` : `any` - Each transformer has a type/class specified by the `class` field shown above. Each class exposes certain configuration options.
		All such options can be configured here. For more details refer to the documentation for the transformer class that you are using.
		Example: [Parameterizer config](https://github.com/konveyor/move2kube/blob/023467328100472fc3ff36218af85b10573247f3/assets/built-in/transformers/kubernetes/parameterizer/transformer.yaml#L19-L18)

## Other files/directories

`templates` - If the `Template` type path mapping created by this transformer uses relative path, it is considered to be relative to this directory.

There can be other files/configs in the directory, and it is interpreted differently by each transformer class. The Transformer class determines how the values are interpreted and executed.

## Transformer Class

The `Transformer Class` determines hold the code for the internal execution of the transformer. It uses the configuration in the `Transformer Yaml` and other config to model its behavior. There are many transformer classes supported by Move2Kube `Kubernetes`, `Parameterizer`, `GolangDockerfileGenerator`, `Executable`, `Starlark`, `Router`, etc.. Most of them have a specific task. But some transformer classes like `Executable` and `Starlark` are very flexible and allow users to write the entire logic of the transformer in the customization. This enables a user to write a fully powerful transformer.

### Transformer Class Internal Implementation

[Source code](https://github.com/konveyor/move2kube/blob/dcf8793a889c0a8f9f4423e9e9ee3a95003c6bcc/transformer/transformer.go#L53-L60)

```golang
// Transformer interface defines transformer that transforms files and converts it to ir representation
type Transformer interface {
	Init(tc transformertypes.Transformer, env *environment.Environment) (err error)
	// GetConfig returns the transformer config
	GetConfig() (transformertypes.Transformer, *environment.Environment)
	DirectoryDetect(dir string) (services map[string][]transformertypes.Artifact, err error)
	Transform(newArtifacts []transformertypes.Artifact, alreadySeenArtifacts []transformertypes.Artifact) ([]transformertypes.PathMapping, []transformertypes.Artifact, error)
}
```

This is the interface all transformers are expected to implement.

- The major function that needs to be implemented is `Transform`.
- If you want your transformer to do something during the planning phase then you can implement `DirectoryDetect` as well. If implement this function, be sure to set
	`directoryDetect` to a value other than `0` in the transformer YAML as well. See [transformer-yaml](/concepts/transformer-yaml) for more details.
- The `Init` and `GetConfig` functions are fixed and cannot be implemented by custom transformers. They are implemented by transformers built into Move2Kube.

### Methods

- `Init` : `(Transformer, Environment) -> (error)` - TODO

- `GetConfig` : `(Transformer, Environment) -> ()` - TODO

- `DirectoryDetect` : `(string) -> (object ([string]: []Artifact), error)` - This function is called during the planning phase. It is passed the path of a directory containing the source files and it returns a list of artifacts. These artifacts will be listed in the plan file generated by Move2Kube. It can also return an error to signal that something went wrong during the planning.
	- The input is a string containing the path to a directory with source files. This could be the source directory itself or a sub-directory.
		The list of directories/sub-directories that are passed to this function depend on the value of `directoryDetect` in the transformer YAML.
		A value of `-1` for `directoryDetect` will cause this function to be run on the source directory and all of its sub-directories.
		A value of `0` for `directoryDetect` will disable this function entirely (it will not be run on any directories).
		A value of `1` for `directoryDetect` will cause this function to be run only on the source directory but not on of its sub-directories.
	- The output is a list of artifacts. These will be included in the plan file.

- `Transform` : `([]Artifact, []Artifact) -> ([]PathMapping, []Artifact, error)` - This function is called during the transformation phase. It contains the code to do the actual transformation and produce (part of) the output of Move2Kube. The path mappings returned by this function cause changes to the output of Move2Kube. The artifacts returned by this function will be passed to other transformers during the next iteration. It can also return an error to signal that something went wrong during the transformation.
	- The first input is a list of new artifacts produced during the previous iteration.
	- The second input is a list of artifacts that the transformer has already seen.
	- The first output is a list of path mappings. A path mapping is a way for transformers to add files to the output directory of Move2Kube.
		Path mappings can be used to generate new files, delete exiting files, modify the output directory structure, etc.
		See [Path Mapping](/concepts/path-mapping) for details.
