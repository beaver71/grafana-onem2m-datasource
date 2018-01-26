import _ from "lodash";

import moment from "moment";

export class GenericDatasource {

  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.withCredentials = instanceSettings.withCredentials;
    this.ae = instanceSettings.jsonData.ae;
    this.origin = instanceSettings.jsonData.origin;
    this.headers = {'Content-Type': 'application/json'};
    if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
      this.headers['Authorization'] = instanceSettings.basicAuth;
    }
    if (this.origin) {
      this.headers['X-M2M-Origin'] = this.origin;
    }
  }

  query(options) {
    var query = this.buildQueryParameters(options);
    query.targets = query.targets.filter(t => !t.hide);

    if (query.targets.length <= 0) {
      return this.q.when({data: []});
    }

    //var qry = "lim="+query.maxDataPoints;
    var qry = "rcn=5&lim="+Math.max(query.maxDataPoints, 10000);
    console.log("query: ", query);

    // "2018-01-19T05:04:06.746Z" ISOstring
    var cra = query.range.from._d;
    var crb = query.range.to._d;
    cra = cra.toISOString().replace(/-/, '').replace(/-/, '').replace(/:/, '').replace(/:/, '').replace(/\..+/, '');
    crb = crb.toISOString().replace(/-/, '').replace(/-/, '').replace(/:/, '').replace(/:/, '').replace(/\..+/, '');
    console.log("cra, crb: ", cra, crb);
    qry += "&cra="+cra+"&crb="+crb;

    if (query.targets.length>1) {
        /* Multi target */
        
        var activeTargets = [];
        for (let target of query.targets) {
            if (target.hide) {
                continue;
            }
            activeTargets.push(target);
        }
        console.log("activeTargets: ", activeTargets);
        
        var url = this.url;
        if (this.ae) url = url + '/' + this.ae;
        var allQueryPromise = _.map(query.targets, target => {
            return this.doRequest({
              url: url + '/' + target.target + '?' + qry,
              data: query,
              method: 'GET'
            });
        });
        var _this = this;
        return this.q.all(allQueryPromise).then(responseList => {
            var result = [];
            _.each(responseList, (response, index) => {
                if (response.status === 200) {
                    if (response.data["m2m:cin"] && response.data["m2m:cin"].length>0) {
                        var data = response.data["m2m:cin"];
                        if (activeTargets[index].type=='table') {
                            console.log(index+"-response: ", data, activeTargets[index].target);
                            result.push(_this._respTable(data));
                        } else if (activeTargets[index].type=='timeserie') {
                            console.log(index+"-response: ", data, activeTargets[index].target, activeTargets[index].field);
                            if (activeTargets[index].field && activeTargets[index].field.path) {
                                result.push(_this._respTimeserie(data, activeTargets[index].field)[0]);
                            } else {
                                var series = _this._respTimeserie(data);
                                for (let serie of series) {
                                    result.push(serie);
                                }
                            }
                        }
                    } else {
                        result.push([]);
                    }
                } else {
                    var resp = { status: "error", message: "error", title: "error" };
                    result.push(resp);
                }
            });
            console.log("ALL-response: ", result);
            return {data: result};
        });
    } else {
        /* mono target */
        var _this = this;
        var url = this.url;
        if (this.ae) url = url + '/' + this.ae;
        var p = new Promise(function(resolve, reject) {
            _this.doRequest({
              url: url + '/' + query.targets[0].target + '?' + qry,
              data: query,
              method: 'GET'
            }).then(function (response) {
              if (response.status === 200) {
                    console.log("response: ", response.data);
                    if (response.data["m2m:cin"] && response.data["m2m:cin"].length>0) {
                        var data = response.data["m2m:cin"];
                        if (query.targets[0].type=='table') {
                            resolve({ data: _this._respTable(data) });
                        } else if (query.targets[0].type=='timeserie') {
                            resolve({ data: _this._respTimeserie(data, query.targets[0].field) });
                        }
                    } else {
                        resolve([]);
                    }
              } else {
                    var resp = { status: "error", message: "error", title: "error" };
                    reject(resp);
              }
            });
        });
        return p;
    }

  }

  testDatasource() {
    var url = this.url;
    if (this.ae) url = url + '/' + this.ae;
    return this.doRequest({
      url: url + '?rcn=5&lim=10',
      method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        return { status: "success", message: "Data source is working", title: "Success" };
      }
    });
  }

  annotationQuery(options) {
    var query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
    var annotationQuery = {
      range: options.range,
      annotation: {
        name: options.annotation.name,
        datasource: options.annotation.datasource,
        enable: options.annotation.enable,
        iconColor: options.annotation.iconColor,
        query: query
      },
      rangeRaw: options.rangeRaw
    };

    return this.doRequest({
      url: this.url + '/annotations',
      method: 'POST',
      data: annotationQuery
    }).then(result => {
      return result.data;
    });
  }

  metricFindQuery(query) {
    var interpolated = {
        target: this.templateSrv.replace(query, null, 'regex')
    };

    var qry = "fu=1&ty=3";
    var url = this.url;
    if (this.ae) url = url + '/' + this.ae;
    var _this = this;


/////////////////////////

    return this.doRequest({
        url: url + '?' + qry,
        method: 'GET'
    }).then(function (result) {
        var data = result.data["m2m:uril"];
        console.log("	>listContainers: ", data);
        var arr = data.split(" ");
        return _.map(arr, function (d, i) {
            if (d) {
                var n = d.replace("/onem2m/" + _this.ae + "/", "");
                return {text: n, value: n};
            }
        });
    });
  }
  
  metricFindFields(query, target) {
    //console.log("metricFindFields: ", query, target);
    var _this = this;
    var url = this.url;
    if (this.ae)
        url = url + '/' + this.ae + '/' + target.target;
    return this.doRequest({
        url: url + '?rcn=5&lim=1',
        method: 'GET',
    }).then(response => {
        if (response.status === 200) {
            var data = response.data["m2m:cin"];
            // search data columns
            var cols = [];
            for (var k in _this._getContent(data[0])) {
                cols.push({text: k, value: k});
            }
            return cols;
        }
    });
  }
  
  metricGetJson(target) {
    //console.log("metricGetJson: ", target);
    var url = this.url;
    if (this.ae)
        url = url + '/' + this.ae + '/' + target.target;
    return this.doRequest({
        url: url + '?rcn=5&lim=1',
        method: 'GET',
    }).then(response => {
        if (response.status === 200) {
            return response.data["m2m:cin"][0].con;
        } else {
            return {};
        }
    });
  }

  doRequest(options) {
    options.withCredentials = this.withCredentials;
    options.headers = this.headers;
    options.headers['X-M2M-RI'] = new Date().getTime();

    return this.backendSrv.datasourceRequest(options);
  }

  buildQueryParameters(options) {
    //remove placeholder targets
    options.targets = _.filter(options.targets, target => {
      return target.target !== 'select metric';
    });

    var targets = _.map(options.targets, target => {
      return {
        target: this.templateSrv.replace(target.target, options.scopedVars, 'regex'),
        refId: target.refId,
        hide: target.hide,
        type: target.type || 'timeserie',
        field: target.field || {},
      };
    });

    options.targets = targets;

    return options;
  }
  
  
    _getContent(cin) {
        var con;
  	if (cin.cnf.indexOf("application/json")!=-1 && typeof cin.con == 'string') {
		try {
                    con = JSON.parse(cin.con);
		} catch(e) {
                    console.warn("json.parse: error=",e.name,"con=",cin.con);
                    con = {};
		}
	} else {
            con = {};
	}
        return con;
    }
  
    _utc2date(utc_str) {
        var d = moment.utc(utc_str).toDate();
        return d;
    }
    
    _respTable(data) {
        var out = [{"columns": [], "rows": [], "type": "table"}];
        // timestamp
        out[0].columns.push({
            "text": "Time",
            "type": "time",
            "sort": true,
            "desc": true,
        });
        // search data columns
        var cols = [];
        for (var k in this._getContent(data[0])) {
            out[0].columns.push({
                "text": k,
            });
            cols.push(k);
        }
        // create table data format
        for (var k in data) {
            var row = [];
            // convert ct UTC date to ts
            row.push(this._utc2date(data[k].ct).getTime());
            for (var i in cols) {
                var prop = cols[i];
                var con = this._getContent(data[k]);
                row.push(con[prop]);
            }
            out[0].rows.push(row);
        }
        console.log("tabled: ", out);
        return out;
    }

    _respTimeserie(data, field) {
        var out = [{"target": null, "datapoints": []}];
        if (field && field.path) {
            out[0].target = field.name || field.path;
            for (var k in data) {
                var props = this._getContent(data[k]);
                var value = _.get(props, field.path);    // lodash _.get(object, path, [defaultValue])
                out[0].datapoints.push([
                    value,
                    this._utc2date(data[k].ct).getTime()	// convert ct UTC date to ts
                ]);
            }
        } else {
            out = [];
            // search data columns
            for (var field in this._getContent(data[0])) {
                console.log(">: ", field);
                var dp = [];
                for (var k in data) {
                    var props = this._getContent(data[k]);
                    dp.push([
                        props[field],
                        this._utc2date(data[k].ct).getTime()	// convert ct UTC date to ts
                    ]);
                }
                out.push({"target": field, "datapoints": dp});
            }
        }
        console.log("timeserie: ", out);
        return out;
    }

}
