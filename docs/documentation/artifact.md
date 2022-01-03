---
layout: default
title: Artifact
permalink: /documentation/artifact
parent: Documentation
nav_order: 2
---

# Artifact

[Source code](https://github.com/konveyor/move2kube/blob/dcf8793a889c0a8f9f4423e9e9ee3a95003c6bcc/types/transformer/artifact.go#L45-L52)
```golang
// Artifact represents the artifact that can be passed between transformers
type Artifact struct {
	Name     string       `yaml:"name,omitempty" json:"name,omitempty"`
	Artifact ArtifactType `yaml:"artifact,omitempty" json:"artifact,omitempty"`

	Paths   map[PathType][]string      `yaml:"paths,omitempty" json:"paths,omitempty" m2kpath:"normal"`
	Configs map[ConfigType]interface{} `yaml:"configs,omitempty" json:"config,omitempty"` // Could be IR or template config or any custom configuration
}
```

Transformers take as input arrays of artifacts and return an array of artifacts.
Each artifact is an object. In order to write transformers effectively we need to understand
the fields of this object.

- `name` : `string` - This field contains the name of the artifact.
- `artifact` : `string` - This field contains the type of the artifact. We can put any artifact type we want.
    Transformers consume artifacts based on their type, so custom artifact types can only be consumed by custom transformers which understand them.
    Example built-in artifact types: `IR`, `KubernetesYamls`, `Dockerfile`, etc.

- `paths` : `object ([string]: []string)` - This field contains a mapping from file type to a list of directories containing files of that type.
    - The key is a string containing the file type.
    - The value is a list of strings/paths to directories containing files of that type.

- `configs` : `object ([string]: any)` - This field contains a mapping between different types of configuration and the configuration data.
    - The key is a string containing the type of configuration.
    - The value can be anything. It is usually an object. Example built-in configs:
        - [types/transformer/artifacts/cloudfoundry.go#L35-L39](https://github.com/konveyor/move2kube/blob/dcf8793a889c0a8f9f4423e9e9ee3a95003c6bcc/types/transformer/artifacts/cloudfoundry.go#L35-L39)
        - [types/transformer/artifacts/java.go#L49-L75](https://github.com/konveyor/move2kube/blob/dcf8793a889c0a8f9f4423e9e9ee3a95003c6bcc/types/transformer/artifacts/java.go#L49-L75)
        - [types/transformer/artifacts/gradle.go#L24-L27](https://github.com/konveyor/move2kube/blob/dcf8793a889c0a8f9f4423e9e9ee3a95003c6bcc/types/transformer/artifacts/gradle.go#L24-L27)
