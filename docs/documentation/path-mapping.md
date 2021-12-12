---
layout: default
title: "Path Mapping"
permalink: /documentation/path-mapping
parent: Documentation
nav_order: 2
---

# Path Mapping

Path mapping is a concept that transformers use to affect the output of Move2Kube. Usually transformers deal with artifacts. They take artifacts as input and output new artifacts. However this does nothing to change the output of Move2Kube since all transformers are run inside temporary directories.
In order to affect the output directory, transformers need to return path mappings indicating the type of change to be made.
For example: Consider a transformer that adds an annotation to Kubernetes Ingress YAML files. The transformer reads the file, adds the annotation and then writes it back out. However this modified file is only present inside the temporary directory and does not appear in the output directory of Move2Kube. To copy this file over to the output directory we can create a path mapping:
```json
{
    "type": "Source",
    "sourcePath": "annotated-ingress.yaml",
    "destinationPath": "deploy/yamls/ingress.yaml"
}
```
and return this from our transformer. Once the transformer is finished, Move2Kube will look at the path mapping our transformer returned and copy over the file to the output directory.

The above example shows the simplest use case for path mappings. However path mappings are capable of much more advanced uses, for example: the source file is a template and needs to be filled in before being copied to the output. Another example is when the source and destination paths are template strings that need to be filled in order to get the actual paths.

## Different type of path mappings

[Source code](https://github.com/konveyor/move2kube/blob/dcf8793a889c0a8f9f4423e9e9ee3a95003c6bcc/types/transformer/pathmapping.go#L19-L45)

```golang
// PathMappingType refers to the Path Mapping type
type PathMappingType = string

const (
	// DefaultPathMappingType allows normal copy with overwrite
	DefaultPathMappingType PathMappingType = "Default" // Normal Copy with overwrite
	// TemplatePathMappingType allows copy of source to destination and applying of template
	TemplatePathMappingType PathMappingType = "Template" // Source path when relative, is relative to yaml file location
	// SourcePathMappingType allows for copying of source directory to another directory
	SourcePathMappingType PathMappingType = "Source" // Source path becomes relative to source directory
	// DeletePathMappingType allows for deleting of files or folder directory
	DeletePathMappingType PathMappingType = "Delete" // Delete path becomes relative to source directory
	// ModifiedSourcePathMappingType allows for copying of deltas wrt source
	ModifiedSourcePathMappingType PathMappingType = "SourceDiff" // Source path becomes relative to source directory
	// PathTemplatePathMappingType allows for path template registration
	PathTemplatePathMappingType PathMappingType = "PathTemplate" // Path Template type
	// SpecialTemplatePathMappingType allows copy of source to destination and applying of template with custom delimiter
	SpecialTemplatePathMappingType PathMappingType = "SpecialTemplate" // Source path when relative, is relative to yaml file location
)

// PathMapping is the mapping between source and intermediate files and output files
type PathMapping struct {
	Type           PathMappingType `yaml:"type,omitempty" json:"type,omitempty"` // Default - Normal copy
	SrcPath        string          `yaml:"sourcePath" json:"sourcePath" m2kpath:"normal"`
	DestPath       string          `yaml:"destinationPath" json:"destinationPath" m2kpath:"normal"` // Relative to output directory
	TemplateConfig interface{}     `yaml:"templateConfig" json:"templateConfig"`
}
```

Below we explain the different types of path mappings:

- `Default` - `sourcePath` must be an absolute path.
    `destinationPath` must be a relative path, relative to Move2Kube's output directory.
    Copies the directory/file specified in `sourcePath` to `destinationPath`.
- `Template` - `sourcePath` must be a relative path, relative to the templates directory of your transformer.
    `destinationPath` must be a relative path, relative to Move2Kube's output directory.
    Fills the template in the file given by `sourcePath` and copies the filled template to `destinationPath`.
    The values for filling the template are be given in `templateConfig`.
- `Source` - Same as `Default` path mapping except now the `sourcePath` can now be a relative path,
    relative to the temporary directory where the transformer is running.
- `Delete` - `sourcePath` must be a relative path, relative to Move2Kube's output directory. The directory/file specified by `sourcePath` will be deleted.
- `SourceDiff` - TODO
- `PathTemplate` - The path itself becomes a template. `sourcePath` contains the templated path. `templateConfig` can be used to set a name for this templated path.
- `SpecialTemplate` - Same as `Template` path mapping except now the template has a different syntax. The delimiters used in normal templates are `{% raw %}{{{% endraw %}` and `{% raw %}}}{% endraw %}`.
    In special templates, the delimiters are `<~` and `~>`. Same as before, the values for filling the template are be given in `templateConfig`.
