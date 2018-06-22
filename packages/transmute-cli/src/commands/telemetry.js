const path = require('path');
const homedir = require('os').homedir();
const fs = require('fs');

let telemetryAgreementPath = path.join(
  homedir,
  '.transmute',
  'telemetry-agreement.json'
);

module.exports.isEnabled = () => {
  let currentlyAgrees = fs.existsSync(telemetryAgreementPath);
  return currentlyAgrees;
};

module.exports.send = mixpanel => {
  return async ({ event, properties }) => {
    if (module.exports.isEnabled()) {
      mixpanel.track(event, properties);
    } else {
      // no agreement, not sending telemetry
    }
  };
};

module.exports.toggle = (vorpal, args) => {
  if (module.exports.isEnabled() && args.state === 'off') {
    fs.unlinkSync(telemetryAgreementPath);
    vorpal.logger.info(
      `transmute telemetry ${args.state}: deleted ${telemetryAgreementPath}`
    );
    return;
  }

  if (!module.exports.isEnabled() && args.state === 'on') {
    fs.writeFileSync(telemetryAgreementPath);
    vorpal.logger.info(
      `transmute telemetry ${args.state}: added ${telemetryAgreementPath}`
    );
    return;
  }

  vorpal.logger.info(`transmute telemetry ${args.state}`);

  return args.state;
};
