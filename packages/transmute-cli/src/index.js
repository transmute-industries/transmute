#!/usr/bin/env node
/** @module TransmuteCLI */

// Process env vars
const MY_ENV = process.env.USE_KUBASH || 'true';

// Vorpal
const vorpal = require('vorpal')();
const vorpalLog = require('vorpal-log');
const vorpalTour = require('vorpal-tour');
vorpal.use(vorpalLog);

// Utils
const { writeFile } = require('./utils');

// Commands
const ls = require('./commands/ls');
const init = require('./commands/init');
const runtest = require('./commands/runtest');
const provision = require('./commands/provision');

// Mixpanel
const Mixpanel = require('mixpanel');
const mixpanel = process.env.MIXPANEL_PROJECT_ID
  ? Mixpanel.init(process.env.MIXPANEL_PROJECT_ID)
  : null;

/** The login command is used to save an okta JWT for api access to ~/.transmute/cli-secrets/session.json
    @name login
    @function
*/

vorpal
  .command('k8s init')
  .description('Initialize k8s cluster')
  .option('--gke', 'Use gcloud GKE')
  .option('--nodes <nodes>', 'How many nodes to create the cluster with')
  .option('--clustername <clustername>', 'The cluster name to create the cluster with')
  .option('--group <group>', 'The group to create the cluster with')
  .option('--aks', 'Use Azure AKS')
  .option('--minikube', 'Use minikube')
  .action(function(args, callback) {
    if (args.options.gke) {
      // gke.init()
      this.log('has not been implemented yet');
    } else if (args.options.aks) {
      var myResourceGroup = args.options.group;
      var myAKSCluster = args.options.clustername;
      var myNodeCount = args.options.nodes;
      if (args.options.gensshkeys) {
        var GenSSHKeys = true;
      }
      else {
        var GenSSHKeys = false;
      }
      init.aks( myResourceGroup, myAKSCluster, myNodeCount, GenSSHKeys )
    } else if (args.options.aws) {
      //aws.init()
      this.log('has not been implemented yet');
    } else if (args.options.minikube) {
      if ( args.options.clusterName ) {
        init.minikube( args.options.clusterName );
      }
      else {
        init.minikube();
      }
    }
    callback();
  });

vorpal
  .command('k8s provision-azure <clustername> <group>')
  .description('Provision k8s cluster in Azure')
  .option('--aks', 'Use Azure AKS')
  .option('--gensshkeys', 'Generate SSH keys')
  .option('--nodes <nodes>', 'How many nodes to create the cluster with')
  .action(function(args, callback) {
      if (args.options.nodes) {
        let myNodeCount = args.options.nodes;
      } else {
        let myNodeCount = 3;
      }
      if (args.options.gensshkeys) {
        let GenSSHKeys = true;
      } else {
        let GenSSHKeys = false;
      }
      provision.aks( args.group, args.clustername, myNodeCount, GenSSHKeys );
    callback();
  });
vorpal
  .command('k8s provision-minikube <clustername>')
  .description('Provision k8s cluster')
  .option('--nodes <nodes>', 'How many nodes to create the cluster with')
  .option('--vmdriver <vmdriver>', 'The cluster name to create the cluster with')
  .action(function(args, callback) {
      if (args.options.vmdriver) {
        provision.minikube( args.clustername, args.options.vmdriver );
      } else {
        provision.minikube( args.clustername );
      }
    callback();
  });

vorpal
  .delimiter('T$')
  .parse(process.argv)
  .show();
