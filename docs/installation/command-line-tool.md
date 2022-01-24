---
layout: default
title: "Command Line Tool"
permalink: /installation/cli/
parent: Installation
nav_order: 1
---

# Move2Kube Command Line Tool

## Linux / MacOS / Windows WSL **(Recommended)**:

To install the latest stable version:
```
bash <(curl https://raw.githubusercontent.com/konveyor/move2kube/main/scripts/install.sh)
```

To install a specific version (for example version `v0.3.0-beta.0`):
```
MOVE2KUBE_TAG='v0.3.0-beta.0' bash <(curl https://raw.githubusercontent.com/konveyor/move2kube/main/scripts/install.sh)
```

To install the bleeding edge version:
```
BLEEDING_EDGE='true' bash <(curl https://raw.githubusercontent.com/konveyor/move2kube/main/scripts/install.sh)
```

## Alternate ways of installing Move2Kube:

**Homebrew**

```
brew tap konveyor/move2kube
brew install move2kube
```

To install a specific version (for example version `v0.3.0-beta.0`):
```
brew install move2kube@0.3.0-beta.0
```

**Go**

Installing using `go get` pulls from the main branch of [Move2Kube](https://github.com/konveyor/move2kube) with the latest development changes.
```
go get -u github.com/konveyor/move2kube
```

**Github release**

The binary can be downloaded from the [GitHub releases page](https://github.com/konveyor/move2kube/releases) of Move2Kube.
