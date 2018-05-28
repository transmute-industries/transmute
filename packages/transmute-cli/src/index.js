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
  .command('k8s init <clustername>')
  .description('Initialize k8s cluster')
  .action(function(args, callback) {
    init.k8s( args.clustername )
    callback();
  });

vorpal
  .command('k8s provision-azure <clustername> <group>')
  .description('Provision k8s cluster in Azure')
  .option('--gensshkeys', 'Generate SSH keys')
  .option('--nodes <nodes>', 'How many nodes to create the cluster with')
  .action(function(args, callback) {
      let myNodeCount = 3;
      if (args.options.nodes) {
        myNodeCount = args.options.nodes;
      }
      let GenSSHKeys = false;
      if (args.options.gensshkeys) {
        GenSSHKeys = true;
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
  .command('version', 'display version information')
  .action(async (args, callback) => {
        const version = require('../package.json').version;
        vorpal.logger.info('transmute: ' + version);
        callback();
  });

vorpal
  .delimiter('T$')
  .parse(process.argv)
  .show();
