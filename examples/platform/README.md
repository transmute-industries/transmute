# Verifiable Data Platform

You can get a `.env` for an appliation service 
from [platform.transmute.industries](https://platform.transmute.industries)

## Get All Presentations

```sh
transmute platform presentations list \
--received \
--sent \
--env '.env'
```


## Pushing all Presentations to Neo4J

Assuming no JSON-LD processing errors

```sh
transmute platform presentations list \
--received \
--sent \
--push-neo4j \
--env '.env'
```

## Get Received Presentations

```sh
transmute platform presentations list \
--received \
--env '.env'
```

## Get Sent Presentations

```sh
transmute platform presentations list \
--sent \
--env '.env'
```
