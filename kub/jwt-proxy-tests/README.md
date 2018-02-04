
```
curl --header "X-TRANSMUTE_AUTH: GOLDEN_TICKET" http://localhost:8008/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme
```

http://localhost:5002/api/v0/id?AUTH=GOLDEN_TICKET


```
jose newkey -t EC -s P-256

{
  "kty": "EC",
  "kid": "MtEjQWt_FMRw43k6i1t-44vAxi5UgRVbm8SeJC9ZCgg",
  "crv": "P-256",
  "x": "-izZN2pxAr0GiwV2ue9jtobIZuw_TglzpeXYTaliTY0",
  "y": "dTHtLJC7lBW7cKU8AiXHssxmLeXiNG4T4aY1xs2YzvM",
  "d": "XAW-M4rkLcFCGlc357_J0q0XLaS7DWDfOhRO-mfdnD0"
}


jose addkey -j
```