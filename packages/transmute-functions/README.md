# Transmute Functions

Work in progress!

Cloud functions for ethereum services.

Portability to other cloud providers in progress.

#### Serve Functions Locally
```sh
transmute serve
```

#### Security Rules

Use firestore.rules to restrict access to everything stored by the framework.

```
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```