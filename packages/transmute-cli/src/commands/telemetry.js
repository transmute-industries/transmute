const path = require('path');
const homedir = require('os').homedir();
const fs = require('fs');

let telemetryAgreementPath = path.join(
  homedir,
  '.transmute',
  'telemetry-agreement.json'
);

export function isEnabled() {
  let currentlyAgrees = fs.existsSync(telemetryAgreementPath);
  return currentlyAgrees;
}

export function send(mixpanel) {
  return async ({ event, properties }) => {
    if (isEnabled()) {
      mixpanel.track(event, properties);
    } else {
      // no agreement, not sending telemetry
    }
  };
}

export function toggle(vorpal, args) {
  if (isEnabled() && args.state === 'off') {
    fs.unlinkSync(telemetryAgreementPath);
    vorpal.logger.info(
      `transmute telemetry ${args.state}: deleted ${telemetryAgreementPath}`
    );
    return;
  }

  if (!isEnabled() && args.state === 'on') {
    fs.writeFileSync(telemetryAgreementPath);
    vorpal.logger.info(
      `transmute telemetry ${args.state}: added ${telemetryAgreementPath}`
    );
    return;
  }

  vorpal.logger.info(`transmute telemetry ${args.state}`);

  return args.state;
}
