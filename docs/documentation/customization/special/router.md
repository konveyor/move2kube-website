---
layout: default
title: Router
permalink: /documentation/customization/special/router
parent: Special
grand_parent: Customization
has_children: false
nav_order: 1
---

# Router

The Router transformer allows for routing an artifact to one among the eligible transformers. A sample usecase for this is to choose the server for a war file.

[WarRouter](https://github.com/konveyor/move2kube/tree/main/assets/inbuilt/transformers/dockerfilegenerator/java/warrouter) and [EarRouter](https://github.com/konveyor/move2kube/tree/main/assets/inbuilt/transformers/dockerfilegenerator/java/earrouter) are examples of uses of this transformer class.