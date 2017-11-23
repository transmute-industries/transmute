## Usage

WARNING this command will overwrite ~/.transmute, potentially destroying secrets you have set there.

Basic setup with placeholder for secrets.

```sh
yarn transmute setup
```

Configure from another folder..

```sh
yarn transmute setup --from ~/Code/secrets/.transmute/
```

### See .transmute

```sh
ls ~/.transmute/
code ~/.transmute/
```