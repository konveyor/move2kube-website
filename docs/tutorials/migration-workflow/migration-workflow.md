---
layout: default
title: "Migrating Enterprise Scale Cloud Foundry Apps to Kubernetes"
permalink: /tutorials/migration-workflow
parent: Tutorials
# Using 95, since nav_order is sorted as a string. The series to follow is 1..9, 91..99,991..999,..
nav_order: 95
has_children: true
---

# Migrating Enterprise Scale Cloud Foundry Apps to Kubernetes

In this tutorial we will go through the entire workflow for migrating a Cloud Foundry application with several micro-services to run on Kubernetes.

We will be using the [enterprise-app](https://github.com/konveyor/move2kube-demos/tree/main/samples/enterprise-app).
It is a retail website for shopping online. The website shows some products for sale and you can create orders by adding things to cart and checking out.

This application consists of 5 different services:
- `frontend` This is the website written using React and Patternfly. It is meant to be run on an Nginx server.
- `gateway` This is the gateway to all the API servers. It aggregates the orders and customer information. It also acts as a circuit breaker in case one of the API servers start to fail. It was written using the Java Spring Boot and PostGreSQL stack.
- `customers` Manages everything related to customers. Runs using Tomcat and PostGreSQL for the database.
- `orders` Manages everything related to orders. It was written using Spring Boot and PostGreSQL for the database.
- `inventory` Manages everything related to products. It was written using Spring Boot and PostGreSQL for the database.

We will go through the workflow for containerizing this application using Move2Kube and getting it running on Kubernetes.
This tutorial is split into sections to make it easy to skip around:
