#!/usr/bin/env node

// Process env vars
const  MY_ENV = process.env.USE_KUBASH ||  'true';

// Vorpal
const vorpal = require('vorpal')();
const vorpalLog = require('vorpal-log');
const vorpalTour = require('vorpal-tour');
vorpal.use(vorpalLog);

// Okta
// import auth from './auth0/index';
const auth = require('./okta/index');

// Utils
const { writeFile } = require('./utils');

// Commands
const provision = require('./commands/provision');
const runtest = require('./commands/runtest');
const init = require('./commands/init');

auth(vorpal);

vorpal
  .command('test')
  .description('Login to service')
  .action(function(args, callback) {
    runtest.test()
    callback();
  });

vorpal
  .command('login <loginService>')
  .description('Login to service')
  .option('--okta', 'Use okta login service')
  .option('--ldap', 'Use ldap login service')
  .option('--oauth', 'Use oauth login service')
  .option('--oauth2', 'Use oauth2 login service')
  .option('--pixie', 'Use pixie login service')
  .alias('l')
  .action(function(args, callback) {
    this.log('login has not been implemented yet');
    callback();
  });

vorpal
  .command('k8s init')
  .description('Initialize k8s cluster')
  .option('--gke', 'Use gcloud GKE')
  .option('--nodes <nodes>', 'How many nodes to create the cluster with')
  .option('--clustername <clustername>', 'The cluster name to create the cluster with')
  .option('--group <group>', 'The group to create the cluster with')
  .option('--gensshkeys', 'Generate SSH keys')
  .option('--aks', 'Use Azure AKS')
  .option('--aws', 'Use Amazon AWS')
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
      provision.aks_register
      provision.aks_init( myResourceGroup, myAKSCluster, myNodeCount, GenSSHKeys )
    } else if (args.options.aws) {
      //aws.init()
      this.log('has not been implemented yet');
    } else if (args.options.minikube) {
      init.minikube()
    }
    callback();
  });

vorpal
  .command('k8s provision <clusterName>')
  .description('Provision k8s cluster')
  .option('--gke', 'Use gcloud GKE')
  .option('--nodes <nodes>', 'How many nodes to create the cluster with')
  .option('--clustername <clustername>', 'The cluster name to create the cluster with')
  .option('--group <group>', 'The group to create the cluster with')
  .option('--gensshkeys', 'Generate SSH keys')
  .option('--aks', 'Use Azure AKS')
  .option('--aws', 'Use Amazon AWS')
  .option('--minikube', 'Use minikube')
  .action(function(args, callback) {
    if (args.options.gke) {
      // gke.provision()
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
      provision.aks_register
      provision.aks_provision( myResourceGroup, myAKSCluster, myNodeCount, GenSSHKeys )
    } else if (args.options.aws) {
      //aws.provision()
      this.log('has not been implemented yet');
    } else if (args.options.minikube) {
      provision.minikube_provision()
    }
    callback();
  });

vorpal
  .command('k8s ls <clusterName>')
  .description('List k8s clusters')
  .option('--gke', 'Use gcloud GKE')
  .option('--aks', 'Use Azure AKS')
  .option('--aws', 'Use Amazon AWS')
  .option('--minikube', 'Use minikube')
  .action(function(args, callback) {
    if (args.options.gke) {
      // gkels()
      this.log('has not been implemented yet');
    } else if (args.options.aks) {
      provision.aks_ls()
    } else if (args.options.aws) {
      //awsls()
      this.log('has not been implemented yet');
    } else if (args.options.minikube) {
      minikube.ls()
    }
    callback();
  });

vorpal
  .command('dapp create')
  .description('create a new distributed app')
  .alias('d')
  .action(function(args, callback) {
    this.log('dapp has not been implemented yet');
    callback();
  });

vorpal
  .command('generate gpgkey', 'Assists in the generation of an GPG key')
  .alias('g')
  .action(function(args, callback) {
    this.log('generate gpgkey has not been implemented yet');
    callback();
  });

vorpal
  .command('generate sshkey', 'Assists in the generation of an SSH key')
  .action(function(args, callback) {
    this.log('generate sshkey has not been implemented yet');
    callback();
  });

vorpal
  .command('group add <member>', 'Adds member to group')
  .action(function(args, callback) {
    this.log('group add <member> has not been implemented yet');
    callback();
  });

vorpal
  .command('group delete <member>', 'Deletes member to group')
  .action(function(args, callback) {
    this.log('group delete <member> has not been implemented yet');
    callback();
  });

vorpal
  .command('push', 'Pushes objects into the cloud')
  .alias('p')
  .action(function(args, callback) {
    this.log('push has not been implemented yet');
    callback();
  });

vorpal
  .command('tunnel <clusterName>')
  .option('-p, --port', 'Tunnel port')
  .option('-s, --svc', 'Tunnel service')
  .action(function(args, callback) {
    this.log('push has not been implemented yet');
    callback();
  });

vorpal
  .delimiter('T$')
  .parse(process.argv)
  .show();
