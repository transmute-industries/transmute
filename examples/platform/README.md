# Verifiable Data Platform

You can get a `.env` for an appliation service
from [platform.transmute.industries](https://platform.transmute.industries)

## Pushing all Presentations to Neo4J

```sh
transmute platform presentations list \
--received \
--sent \
--push-neo4j \
--env '.env'
```

Presentations with JSON-LD errors are not available for analysis in Neo4j, and will produce console warnings.

<!--
```sh
npm run build;

npm run transmute -- platform presentations list \
--received \
--sent \
--push-neo4j \
--env '.env'
```
--->
