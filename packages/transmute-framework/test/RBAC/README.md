# Nothing is Secure

This is alpha software, there will be bugs, vulns, etc...

Do not use in production, you have been warned.

If you would like to conduct an audit, please do, and submit a PR with your findings.

If you would like to learn how to audit smart contracts, give it a try and we'll give you some feedback ;) 

### Access Control

We aim for parity to https://www.npmjs.com/package/accesscontrol

We'll start with parity for a limited set of attributes, namely: `['*']` and `[]`

Also, even if an account can write grants, they cannot write grants for the grant resource unless they are the owner.

We don't want an editor making super admins...

