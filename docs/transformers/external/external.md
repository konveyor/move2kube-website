---
layout: default
title: Executable
permalink: /transformers/external/executable
parent: External
grand_parent: Transformers
has_children: false
nav_order: 2
---

# External

Move2Kube allows defining transformers which could be defined natively (e.g. developer's laptop) or in a containerized environment. The `directory_detect` and `transform` operations should be implemented as scripts residing within the container or natively so that they are invoked by Move2Kube. They should perform the following functions:
* `directory_detect()` - It should be implemented to check if there are relevant files in the directory to invoke the transformer. See example [here](https://github.com/konveyor/move2kube-transformers/blob/main/containerized-external-transformer/detect.py).
* `transform()` - It should be implemented to make changes on the input artifacts and output relevant artifacts for the rest of the transformation journey. See example [here](https://github.com/konveyor/move2kube-transformers/blob/main/containerized-external-transformer/transform.py).

For a containerized transformer, a dockerfile is required to build the container image for the transformer and use it as part of the Move2Kube pipeline. An illustration for a python-based containerized transformer can be seen [here](https://github.com/konveyor/move2kube-transformers/blob/main/containerized-external-transformer/Dockerfile).

Further more, the containerize transformer will also require a container configuration as shown [here](https://github.com/konveyor/move2kube-transformers/blob/53791c15266c869aa7a29d4132d60347d3675f9e/containerized-external-transformer/transformer.yaml#L24-L30).  This container context contains the container image name (`image`), working directory (`workingDir`), a keep-alive command (`keepAliveCommand`) to keep the container alive while the transformer scripts are executed by Move2Kube, a build context which defines the dockerfile and location of the files to include in the container. 
For the native transformer, the container configuration could be skipped altogether.

## Common configurations

The common configuration to external transformers (containerized and native) include the directory detect command (`directoryDetectCMD`), transform command (`transformCMD`) and the optional environment list (`env`) to define the environments to be included during the execution of the scripts. Users could either define no CLI arguments in the commands for the above scripts as shown below:
```
transformCMD: ["python", "./transform.py"]
```
In the above case, the scripts will have to ready the input and output paths from the environment variables (see below list).
The users also have the flexibility of designing their scripts to accept input/output paths as CLI arguments as illustrated below:
```
directoryDetectCMD: ["python", "./detect.py", "input=$M2K_DETECT_INPUT_PATH", "output=$M2K_DETECT_OUTPUT_PATH"]
```
In the above example, Move2Kube will automatically fill the values of `$M2K_DETECT_INPUT_PATH` and `$M2K_DETECT_OUTPUT_PATH` before invoking the above scripts so that the script could receive the CLI arguments without worrying about where the values came from.
External transformers have the flexibility of using a mix of both the approaches according to the developer convenience.

## Default environment variables
There are some default environments which define the input/output paths for the detect and transform functions. They are as follows:
- `M2K_DETECT_INPUT_PATH`: Specifies the detect input file path. This will contain the directory path to perform directory detect on. This is Move2Kube generated path and cannot be overridden by the user.
- `M2K_DETECT_OUTPUT_PATH`: Specifies the detect output file path. This will contain the output artifact paths detected by the `directory_detect()` function. This path could be specified by the user in the `env` section of the `transformer.yaml`. Alternatively, if this environment is not defined, the environment variable will contain a Move2Kube generated path. The user will be responsible for creating the directory tree for this path in the detect script before writing the output to it.
- `M2K_TRANSFORM_INPUT_PATH`: Specifies the transform input file path. This will contain the new and already seen artifacts to perform transformation on, specified in JSON format. The new artifacts are listed as an array under the `newArtifacts` key and the already seen artifacts are specified under the `alreadySeenArtifacts` key.  This is Move2Kube generated path and cannot be overridden by the user.
- `M2K_TRANSFORM_OUTPUT_PATH`: Specifies the transform output file path. The output will contain the artifacts (`pathMappings` key) and path-mappings (`pathMappings` key) in a single JSON file. his path could be specified by the user in the `env` section of the `transformer.yaml`. Alternatively, if this environment is not defined, the environment variable will contain a Move2Kube generated path. The user will be responsible for creating the directory tree for this path in the detect script before writing the output to it.