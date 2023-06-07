---
layout: default
title: "Collecting only selected Cloud Foundry applications metadata"
permalink: /tutorials/collect-selected-cf-apps/
parent: Tutorials
nav_order: 6
---

# Using Move2Kube Collect to collect only selected Cloud Foundry application(s) metadata

To analyze your applications running in Cloud Foundry, the Move2Kube CLI tool provides a command called `collect`. As the name suggests the `collect` command can be used to collect information about applications running in the Cloud Foundry instance. It can also be used to collect the types of resources that are installed on your Kubernetes/OpenShift cluster, etc.

- Install the latest version of Move2Kube. This tutorial was created using Move2Kube `v0.3.8-rc.0`.

  ```console
  $ MOVE2KUBE_TAG='v0.3.8-rc.0' bash <(curl https://raw.githubusercontent.com/konveyor/move2kube/main/scripts/install.sh)
    % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  100 10818  100 10818    0     0  14568      0 --:--:-- --:--:-- --:--:-- 14658
  Installing move2kube
  Downloading https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64
  The desired Move2Kube version v0.3.8-rc.0 is already installed
  Done!
  cleaning up temporary files and directories...
  ```

  You can check the installed version of Move2Kube by running the below command.

  ```console
  $ move2kube version -l
  move2kube version -l
  version: v0.3.8-rc.0
  gitCommit: 5113d4ce474a1bdba04d1656490ddec38a36d804
  gitTreeState: clean
  goVersion: go1.18.10
  ```

- For collecting information from cf running instance, you might require `cf` CLI or `ibmcloud cf` CLI for logging into Cloud Foundry using `cf login` or `ibmcloud login`.

  ```console
  $ cf version                                               
  cf version 6.53.0+8e2b70a4a.i
  ```

  or

  ```console
  $ ibmcloud cf version                    
  Invoking 'cf version'...
  cf version 6.53.0+8e2b70a4a.2020-10-01
  ```

- If you are logged into the cloud foundry instance, information about the apps such as environment variables, services and more are collected using `move2kube collect`. If you are logged into Kubernetes/OpenShift clusters, it collects information about the types of resources that are installed on the cluster, whether it has Tekton, BuildConfigs, etc.

- All the information that Move2Kube collected gets written into a directory called `m2k_collect` as YAML files. In this case, the info about Cloud Foundry apps is written to a sub-directory called `cf`. These YAMLs can then be used during the plan phase to get a wholistic plan combining the source and metadata.
For example: Some of the information that is collected is port, environment variables information, and memory. This allows Move2Kube to select the right ports and set right environment variables for each service when generating Dockerfiles for containerizing these services.

## Collecting selected apps information from Cloud Foundry instance

1. Make sure you have the `cf` tool installed and you have logged into your Cloud Foundry instance.
You can run `cf target` to check if you are logged in. The output should be similar to this:

    ```console
    $ cf target
    API endpoint:   https://api.cf.my.cloud.provider.com
    API version:    3.107.0
    user:           user123@xyz.com
    org:            my-org
    space:          dev
    ```

    To list all the apps that are running on your Cloud Foundry instance run `cf apps` (or `ibmcloud cf apps`) as shown below.

    ```console
    $ cf apps       
    Getting apps in org myorg / space dev as user123@xyz.com...
    OK

    name                 requested state   instances   memory   disk   urls
    frontend             started           1/1         2G       1G     enterprise-app-frontend.mydomain.net
    gateway              started           3/3         700M     1G     enterprise-app-gateway.mydomain.net
    orders               started           1/1         700M     1G     enterprise-app-orders.mydomain.net
    customers            started           1/1         1G       1G     enterprise-app-customers.mydomain.net
    inventory            started           1/1         640M     1G     enterprise-app-inventory.mydomain.net
    cfnodejsapp          started           4/4         256M     1G     cfnodejsapp-relaxed-aardvark-wu.mydomain.net
    ```

    In the above output, we see that there are six apps (`frontend`, `gateway`, `orders`, `customers`, `inventory`, and `cfnodejsapp`) that are running on Cloud Foundry.

1. By default, `move2kube collect` collects the runtime information of all the apps which are deployed to the Cloud Foundry instance. But, there may be instances where there is a large number (100s or 1000s) of apps which are deployed on Cloud Foundry, and we want to restrict `move2kube collect` to collect the information of only a smaller subset of apps. This could also speed up the execution of `move2kube collect` compared to when it has to fetch the info of all the apps.

   Move2kube can now be used to collect only selected CF apps metadata through a yaml. First, create a new folder (say, `collect_input`) and inside the new folder create a YAML file (say, `collect_cfapps.yaml`) which contains the CF app Names/Guids for which you want to collect the runtime information. A sample YAML file is provided below to collect the `inventory` and `cfnodejsapp` apps info.

    ```yaml
    apiVersion: move2kube.konveyor.io/v1alpha1
    kind: CfCollectApps
    spec:
      applications:
        - application:
            # guid: dummy-cf-app-guid-inventory
            name: inventory
        - application:
            name: cfnodejsapp
            # guid: dummy-cf-app-guid-cfnodejsapp
    ```

    **Optional**: If there are multiple CF spaces in your CF org, then you can also filter apps from a particular CF space by specifying the CF spaceguid in `spec.filters.spaceguid` as shown in the below yaml.

    ```yaml
    apiVersion: move2kube.konveyor.io/v1alpha1
    kind: CfCollectApps
    spec:
      filters:
        spaceguid: dummy-cf-space-guid
      applications:
        - application:
            # guid: dummy-cf-app-guid-inventory
            name: inventory
        - application:
            name: cfnodejsapp
            # guid: dummy-cf-app-guid-cfnodejsapp
    ```

    Move2Kube collect also allows to specify the `query_depth` in `spec.filters.query_depth` in the YAML. The `query_depth` parameter is used while fetching the application information from Cloud Foundry. By default, the `query_depth` is set to "2". It can be changed to "0" or "1", as shown in the below example, and it can speed up the execution of `move2kube collect` command, but it may result in losing some data (which is likely to be redundant data).

    ```yaml
    apiVersion: move2kube.konveyor.io/v1alpha1
    kind: CfCollectApps
    spec:
      filters:
        query_depth: "0"
      applications:
        - application:
            name: inventory
        - application:
            name: cfnodejsapp
    ```

1. Run `move2kube collect -a cf -s collect_input`  to collect information about the selected apps (`inventory` and `cfnodejsapp`), from Cloud Foundry. If you want to collect information of all the apps from Cloud Foundry, run `move2kube collect -a cf`.

    ```console
    $ ls collect_input
    collect_cfapps.yaml
    ```

    ```console
    $ cat collect_input/collect_cfapps.yaml
    apiVersion: move2kube.konveyor.io/v1alpha1
    kind: CfCollectApps
    spec:
      filters:
        query_depth: "0"
      applications:
        - application:
            name: inventory
        - application:
            name: cfnodejsapp
    ```

    ```console
    $ move2kube collect -a cf -s collect_input
    INFO[0000] Begin collection
    INFO[0000] [*collector.CfAppsCollector] Begin collection
    INFO[0007] Changing metadata name from IBM Cloud to ibm-cloud
    INFO[0009] [*collector.CfAppsCollector] Done
    INFO[0009] [*collector.CfServicesCollector] Begin collection
    INFO[0013] Changing metadata name from IBM Cloud to ibm-cloud
    INFO[0013] [*collector.CfServicesCollector] Done
    INFO[0013] Collection done
    INFO[0013] Collect Output in [/Users/user/demo/m2k_collect].Copy this directory into the source directory to be used for planning.
    ```

    The output will be in a directory called `m2k_collect`. Inside it we can see a directory called `cf`.
    There are 2 YAML files inside it. One is `CfApps` and the other is `CfServices`:

    ```console
    $ ls m2k_collect/
    cf		clusters	images
    $ ls m2k_collect/cf/
    cfapps-e3a2f9d68a7a5ecc.yaml		cfservices-32194c9906854947.yaml
    ```

    The `CfApps` YAML file contains all the information that was collected about our apps such as service names, environment variables, ports, etc.

    ```yaml
    apiVersion: move2kube.konveyor.io/v1alpha1
    kind: CfApps
    metadata:
      name: ibm-cloud
    spec:
      applications:
        - application:
            guid: dummy-cf-app-guid-inventory
            createdat: "2022-07-11T07:10:27Z"
            updatedat: "2023-05-14T13:16:32Z"
            name: inventory
            memory: 640
            instances: 1
            diskquota: 1024
            spaceguid: my_cf_space_guid
            stackguid: my_cf_stack_guid
            state: STARTED
            packagestate: STAGED
            command: ""
            buildpack: https://github.com/cloudfoundry/java-buildpack
            detectedbuildpack: java
            detectedbuildpackguid: ""
            healthcheckhttpendpoint: ""
            healthchecktype: port
            healthchecktimeout: 180
            diego: true
            enablessh: true
            detectedstartcommand: 'JAVA_OPTS="-agentpath:$PWD/.java-buildpack/open_jdk_jre/bin/jvmkill-1.16.0_RELEASE=printHeapHistogram=1 -Djava.io.tmpdir=$TMPDIR -XX:ActiveProcessorCount=$(nproc) -Djava.ext.dirs=$PWD/.java-buildpack/container_security_provider:$PWD/.java-buildpack/open_jdk_jre/lib/ext -Djava.security.properties=$PWD/.java-buildpack/java_security/java.security $JAVA_OPTS" && CALCULATED_MEMORY=$($PWD/.java-buildpack/open_jdk_jre/bin/java-buildpack-memory-calculator-3.13.0_RELEASE -totMemory=$MEMORY_LIMIT -loadedClasses=17744 -poolType=metaspace -stackThreads=250 -vmOptions="$JAVA_OPTS") && echo JVM Memory Configuration: $CALCULATED_MEMORY && JAVA_OPTS="$JAVA_OPTS $CALCULATED_MEMORY" && MALLOC_ARENA_MAX=2 SERVER_PORT=$PORT eval exec $PWD/.java-buildpack/open_jdk_jre/bin/java $JAVA_OPTS -cp $PWD/. org.springframework.boot.loader.JarLauncher'
            dockerimage: ""
            dockercredentialsjson: {}
            dockercredentials:
              username: ""
              password: ""
            environment: {}
            stagingfailedreason: ""
            stagingfaileddescription: ""
            ports:
              - 8080
            spaceurl: /v2/spaces/my_cf_space_guid
            spacedata:
              meta:
                guid: ""
                url: ""
                createdat: ""
                updatedat: ""
              entity:
                guid: ""
                createdat: ""
                updatedat: ""
                name: ""
                organizationguid: ""
                orgurl: ""
                orgdata:
                  meta:
                    guid: ""
                    url: ""
                    createdat: ""
                    updatedat: ""
                  entity:
                    guid: ""
                    createdat: ""
                    updatedat: ""
                    name: ""
                    status: ""
                    quotadefinitionguid: ""
                    defaultisolationsegmentguid: ""
                quotadefinitionguid: ""
                isolationsegmentguid: ""
                allowssh: false
            packageupdatedat: "2022-07-11T07:10:43Z"
          environment:
            environment: {}
            stagingenv:
              BLUEMIX_REGION: ibm:yp:us-south
            runningenv:
              BLUEMIX_REGION: ibm:yp:us-south
            systemenv:
              VCAP_SERVICES: '{}'
            applicationenv:
              VCAP_APPLICATION: '{"application_id":"dummy-cf-app-guid-inventory","application_name":"inventory","application_uris":["enterprise-app-inventory.mydomain.net"],"application_version":"aeb11cd9-2af5-4f68-be03-972d5ae3694b","cf_api":"https://api.us-south.cf.cloud.ibm.com","limits":{"disk":1024,"fds":16384,"mem":640},"name":"inventory","organization_id":"my_org_id","organization_name":"my_org","process_id":"dummy-cf-app-guid-inventory","process_type":"web","space_id":"my_cf_space_guid","space_name":"dev","uris":["enterprise-app-inventory.mydomain.net"],"users":null,"version":"aeb11cd9-2af5-4f68-be03-972d5ae3694b"}'
        - application:
            guid: dummy-cf-app-guid-cfnodejsapp
            createdat: "2022-04-26T07:37:11Z"
            updatedat: "2023-04-06T07:47:53Z"
            name: cfnodejsapp
            memory: 256
            instances: 4
            diskquota: 1024
            spaceguid: my_cf_space_guid
            stackguid: my_cf_stack_guid
            state: STARTED
            packagestate: STAGED
            command: ""
            buildpack: ""
            detectedbuildpack: nodejs
            detectedbuildpackguid: 7dfdebec-f05d-4f4e-9c1e-f5841cbae7dc
            healthcheckhttpendpoint: ""
            healthchecktype: port
            healthchecktimeout: 0
            diego: true
            enablessh: true
            detectedstartcommand: npm start
            dockerimage: ""
            dockercredentialsjson: {}
            dockercredentials:
              username: ""
              password: ""
            environment: {}
            stagingfailedreason: ""
            stagingfaileddescription: ""
            ports:
              - 8080
            spaceurl: /v2/spaces/my_cf_space_guid
            spacedata:
              meta:
                guid: ""
                url: ""
                createdat: ""
                updatedat: ""
              entity:
                guid: ""
                createdat: ""
                updatedat: ""
                name: ""
                organizationguid: ""
                orgurl: ""
                orgdata:
                  meta:
                    guid: ""
                    url: ""
                    createdat: ""
                    updatedat: ""
                  entity:
                    guid: ""
                    createdat: ""
                    updatedat: ""
                    name: ""
                    status: ""
                    quotadefinitionguid: ""
                    defaultisolationsegmentguid: ""
                quotadefinitionguid: ""
                isolationsegmentguid: ""
                allowssh: false
            packageupdatedat: "2022-04-26T07:37:17Z"
          environment:
            environment: {}
            stagingenv:
              BLUEMIX_REGION: ibm:yp:us-south
            runningenv:
              BLUEMIX_REGION: ibm:yp:us-south
            systemenv:
              VCAP_SERVICES: '{"cloudantNoSQLDB":[{"binding_guid":"cloudant-binding-guid","binding_name":null,"credentials":{"apikey":"my-api-key","host":"dummy-mydomain.cloudantnosqldb.appdomain.cloud","instance_name":"Cloudant-test","label":"cloudantNoSQLDB","name":"Cloudant-test","plan":"lite","provider":null,"syslog_drain_url":null,"volume_mounts":[]}]}'
            applicationenv:
              VCAP_APPLICATION: '{"application_id":"dummy-cf-app-guid-cfnodejsapp","application_name":"cfnodejsapp","application_uris":["cfnodejsapp-relaxed-aardvark-wu.mydomain.net"],"application_version":"7de5f9ee-737d-4679-8019-abb47ef56399","cf_api":"https://api.us-south.cf.cloud.ibm.com","limits":{"disk":1024,"fds":16384,"mem":256},"name":"cfnodejsapp","organization_id":"my_org_id","organization_name":"my_org","process_id":"dummy-cf-app-guid-cfnodejsapp","process_type":"web","space_id":"my_cf_space_guid","space_name":"dev","uris":["cfnodejsapp-relaxed-aardvark-wu.mydomain.net"],"users":null,"version":"7de5f9ee-737d-4679-8019-abb47ef56399"}'
    ```

Now, after we have collected the runtime information for the particular CF apps that we added in the `collect_cfapps.yaml` file, we can use this collected runtime information during the transform/planning phase by simply copying `m2k_collect` folder into the source directory before starting the `planning`/`transform` phase.

## Next steps

Run `move2kube transform` (or `move2kube plan`) on the source directory which also contains the copied `m2k_collect` folder.
