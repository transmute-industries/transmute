## Examples

### Get Holder Location

```
MATCH (holder:`https://www.w3.org/2018/credentials#holder`)-[:Location]->(place:`https://schema.org/Place`)
MATCH (place)-[:Geo]->(point:`https://schema.org/GeoCoordinates`)
RETURN holder, point
```

### Get Issuer Location

```
MATCH (issuer:`https://www.w3.org/2018/credentials#issuer`)-[:Location]->(place:`https://schema.org/Place`)
MATCH (place)-[:Geo]->(point:`https://schema.org/GeoCoordinates`)
RETURN issuer, point
```

### Distance Between Issuer and Holder

```
MATCH (issuer:`https://www.w3.org/2018/credentials#issuer`)-[:Location]->(p1:`https://schema.org/Place`)
MATCH (p1)-[:Geo]->(p2:`https://schema.org/GeoCoordinates`)
MATCH (holder:`https://www.w3.org/2018/credentials#holder`)-[:Location]->(p3:`https://schema.org/Place`)
MATCH (p3)-[:Geo]->(p4:`https://schema.org/GeoCoordinates`)
WITH
  point({longitude: toFloat(p2.`https://schema.org/longitude`), latitude: toFloat(p2.`https://schema.org/latitude`)}) AS issuerPoint,
  point({longitude: toFloat(p4.`https://schema.org/longitude`), latitude: toFloat(p4.`https://schema.org/latitude`)}) AS holderPoint
RETURN round(point.distance(issuerPoint, holderPoint)) AS presentationDistance
```

