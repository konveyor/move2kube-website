---
layout: default
title: "Migration workflow"
permalink: /tutorials/migration-workflow
parent: Tutorials
nav_order: 4
has_children: true
---

# Migration workflow

In this tutorial we will go through the entire workflow for migrating an application to run on Kubernetes.
We will be using the [Konveyor End-to-End demo app](https://github.com/konveyor/move2kube-demos/tree/main/samples/enterprise-app).
It is a retail website for shopping online. The website shows some products for sale and you can create orders by adding things to cart and checking out.

This application consists of 5 different services:
    - `frontend` is the website written using React and Patternfly. It is meant to be run on an Nginx server.
    - `gateway` This is the API gateway for all user requests. It was written using the Java Spring Boot and PostGreSQL stack.
    - `orders` Manages everything related to orders. It was written using Spring Boot + PostGreSQL for database.
    - `inventory` Provides detailed information on various products. Written using Quarkus and PostGreSQL.
    - `customers` Manages everything related to customers. Runs using Tomcat and Oracle for database.

We will go through the workflow for containerizing this application using Move2Kube and getting it running on Kubernetes.
This tutorial is split into sections to make it easy to skip around:
