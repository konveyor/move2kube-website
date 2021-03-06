---
layout: default
title: plan
permalink: /commands/plan
parent: Commands
---
## move2kube plan

Plan out a move

### Synopsis

Discover and create a plan file based on an input directory

```
move2kube plan [flags]
```

### Options

```
  -f, --config strings                Specify config file locations.
  -c, --customizations string         Specify directory where customizations are stored.
      --disable-local-execution       Allow files to be executed locally.
  -h, --help                          help for plan
  -n, --name string                   Specify the project name. (default "myproject")
  -p, --plan string                   Specify a file path to save plan to. (default "m2k.plan")
      --preset strings                Specify preset config to use.
      --set-config stringArray        Specify config key-value pairs.
  -s, --source string                 Specify source directory. (default ".")
  -t, --transformer-selector string   Specify the transformer selector.
```

### Options inherited from parent commands

```
      --log-file string    File to store the logs in. By default it only prints to console.
      --log-level string   Set logging levels. (default "info")
```

### SEE ALSO

* [move2kube](/commands)	 - Move2Kube creates all the resources required for deploying your application into kubernetes, including containerisation and kubernetes resources.

###### Auto generated by spf13/cobra on 24-Jan-2022
