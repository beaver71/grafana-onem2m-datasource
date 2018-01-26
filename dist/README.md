## OneM2M Datasource - a backend datasource for OneM2M http server

More documentation about datasource plugins can be found in the [Docs](https://github.com/grafana/grafana/blob/master/docs/sources/plugins/developing/datasources.md).

This plugin is based on: https://github.com/grafana/simple-json-datasource
 
## Installation

Install manually this plugin as specified in [Grafana Docs](http://docs.grafana.org/plugins/installation/):

1. Copy `/dist` folder into the Grafana Server’s plugins directory (generally `/var/lib/grafana/plugins`).

2. Restart the Grafana Server.

### Example OneM2M backend implementation

- https://github.com/beaver71/Mobius


### OneM2M APIs

- http://www.onem2m.org/
- http://www.onem2m.org/application-developer-guide


### Dev setup and build

This plugin requires node 6.10.0

`npm install`

`grunt`
