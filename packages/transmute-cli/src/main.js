#!/usr/bin/env node
//const argv = require('yargs').argv;
const shell = require('shelljs');
var vorpal = require('vorpal')();
var hello = 'hello world!';
var hello_cmd = "echo " + hello ;

const  MY_ENV = process.env.MY_ENV ||  'HELLO';

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
  .command('k8s <k8sAction> <clusterName>')
  .option('--gke', 'Use gcloud GKE')
  .option('--aks', 'Use Azure AKS')
  .option('--aws', 'Use Amazon AWS')
  .option('--minikube', 'Use minikube')
  .option('provision', 'Provision new k8s cluster')
  .option('terminate', 'Terminate k8s cluster')
  .alias('k')
  .action(function(args, callback) {
    this.log('k8s has not been implemented yet');
    callback();
  });

vorpal
  .command('dapp <dappAction>')
  .option('create', 'create a new dapp')
  .autocomplete('create', 'teardown')
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
  .command('push', 'Outputs "industries"')
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
