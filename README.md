## OneM2M Datasource - a backend datasource for OneM2M http server

More documentation about datasource plugins can be found in the [Docs](https://github.com/grafana/grafana/blob/master/docs/sources/plugins/developing/datasources.md).

This plugin is based on: https://github.com/grafana/simple-json-datasource
 
 
### Dev setup and build

This plugin requires node 6.10.0

1. install dependencies: 

`npm install`

2. create `settings.js` under `/src` folder like below: 

`export default
{
    "url": "https://myserver.com/onem2m",
    "ae": [
        {"text": "AE 1", "value": "ae_1"},
        {"text": "AE 2", "value": "ae_2"},
    ]
}`

3. build:

`grunt`

 
## Installation

Install manually this plugin as specified in [Grafana Docs](http://docs.grafana.org/plugins/installation/):

1. Copy `/dist` folder into the Grafana Server’s plugins directory (generally `/var/lib/grafana/plugins`).

2. Restart the Grafana Server.

### Example OneM2M backend implementation

- https://github.com/beaver71/Mobius


### OneM2M APIs

- http://www.onem2m.org/
- http://www.onem2m.org/application-developer-guide


