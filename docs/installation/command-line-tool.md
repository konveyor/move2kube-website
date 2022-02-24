---
layout: default
title: "Command Line Tool"
permalink: /installation/cli
parent: Installation
nav_order: 1
---

# Move2Kube Command Line Tool

## Download the binary

The easiest way to get Move2Kube is to download the binary from the list of releases on Github:

[https://github.com/konveyor/move2kube/releases](https://github.com/konveyor/move2kube/releases)

We provide pre-built binaries for Linux, MacOS and Windows.

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

To install without sudo
```
USE_SUDO=false bash <(curl https://raw.githubusercontent.com/konveyor/move2kube/main/scripts/install.sh)
```

By default the script installs to `/usr/local/bin`. To install to a different directory
```
MOVE2KUBE_INSTALL_DIR=/my/new/install/dir bash <(curl https://raw.githubusercontent.com/konveyor/move2kube/main/scripts/install.sh)
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
