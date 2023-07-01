# Move2Kube GitHub pages repo

This repository holds the code that generates the [Move2Kube Project's web page](https://move2kube.konveyor.io/).

## Contributing

1. If making changes to typescript files please run `yarn run build && yarn run bundle` to build typescript and update the bundle.
2. Do `git add -A` **AFTER** generating the bundle to add the bundle to the commit.

### Running the development environment

```console
$ docker run --rm -it -p 4000:4000 -v "${PWD}:/app" quay.io/konveyor/move2kube-website:v0.3.5
```
