# Node.js on Storm

Run Node.js on Apache Storm. 

## Run example

```sh
docker-compose up -d
docker-compose run --rm nimbus bin/example.js
open http://localhost:8080
```

Clean up:

```sh
docker-compose down -v
```

----
See also:

- [node-storm](https://github.com/RallySoftware/node-storm)
- [storm-starter](https://github.com/apache/storm/tree/master/examples/storm-starter/multilang/resources)
- [storm-multilang for javascript](https://github.com/apache/storm/blob/master/storm-multilang/javascript/src/main/resources/resources/storm.js)
- [Multilang protocol](http://storm.apache.org/releases/1.0.2/Multilang-protocol.html)
