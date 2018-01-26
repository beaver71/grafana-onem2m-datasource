"use strict";

System.register(["lodash", "moment"], function (_export, _context) {
    "use strict";

    var _, moment, _createClass, GenericDatasource;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_lodash) {
            _ = _lodash.default;
        }, function (_moment) {
            moment = _moment.default;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export("GenericDatasource", GenericDatasource = function () {
                function GenericDatasource(instanceSettings, $q, backendSrv, templateSrv) {
                    _classCallCheck(this, GenericDatasource);

                    this.type = instanceSettings.type;
                    this.url = instanceSettings.url;
                    this.name = instanceSettings.name;
                    this.q = $q;
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.withCredentials = instanceSettings.withCredentials;
                    this.ae = instanceSettings.jsonData.ae;
                    this.origin = instanceSettings.jsonData.origin;
                    this.headers = { 'Content-Type': 'application/json' };
                    if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
                        this.headers['Authorization'] = instanceSettings.basicAuth;
                    }
                    if (this.origin) {
                        this.headers['X-M2M-Origin'] = this.origin;
                    }
                }

                _createClass(GenericDatasource, [{
                    key: "query",
                    value: function query(options) {
                        var _this2 = this;

                        var query = this.buildQueryParameters(options);
                        query.targets = query.targets.filter(function (t) {
                            return !t.hide;
                        });

                        if (query.targets.length <= 0) {
                            return this.q.when({ data: [] });
                        }

                        //var qry = "lim="+query.maxDataPoints;
                        var qry = "rcn=5&lim=" + Math.max(query.maxDataPoints, 10000);
                        console.log("query: ", query);

                        // "2018-01-19T05:04:06.746Z" ISOstring
                        var cra = query.range.from._d;
                        var crb = query.range.to._d;
                        cra = cra.toISOString().replace(/-/, '').replace(/-/, '').replace(/:/, '').replace(/:/, '').replace(/\..+/, '');
                        crb = crb.toISOString().replace(/-/, '').replace(/-/, '').replace(/:/, '').replace(/:/, '').replace(/\..+/, '');
                        console.log("cra, crb: ", cra, crb);
                        qry += "&cra=" + cra + "&crb=" + crb;

                        if (query.targets.length > 1) {
                            /* Multi target */

                            var activeTargets = [];
                            var _iteratorNormalCompletion = true;
                            var _didIteratorError = false;
                            var _iteratorError = undefined;

                            try {
                                for (var _iterator = query.targets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    var target = _step.value;

                                    if (target.hide) {
                                        continue;
                                    }
                                    activeTargets.push(target);
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return) {
                                        _iterator.return();
                                    }
                                } finally {
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }

                            console.log("activeTargets: ", activeTargets);

                            var url = this.url;
                            if (this.ae) url = url + '/' + this.ae;
                            var allQueryPromise = _.map(query.targets, function (target) {
                                return _this2.doRequest({
                                    url: url + '/' + target.target + '?' + qry,
                                    data: query,
                                    method: 'GET'
                                });
                            });
                            var _this = this;
                            return this.q.all(allQueryPromise).then(function (responseList) {
                                var result = [];
                                _.each(responseList, function (response, index) {
                                    if (response.status === 200) {
                                        if (response.data["m2m:cin"] && response.data["m2m:cin"].length > 0) {
                                            var data = response.data["m2m:cin"];
                                            if (activeTargets[index].type == 'table') {
                                                console.log(index + "-response: ", data, activeTargets[index].target);
                                                result.push(_this._respTable(data));
                                            } else if (activeTargets[index].type == 'timeserie') {
                                                console.log(index + "-response: ", data, activeTargets[index].target, activeTargets[index].field);
                                                if (activeTargets[index].field && activeTargets[index].field.path) {
                                                    result.push(_this._respTimeserie(data, activeTargets[index].field)[0]);
                                                } else {
                                                    var series = _this._respTimeserie(data);
                                                    var _iteratorNormalCompletion2 = true;
                                                    var _didIteratorError2 = false;
                                                    var _iteratorError2 = undefined;

                                                    try {
                                                        for (var _iterator2 = series[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                                            var serie = _step2.value;

                                                            result.push(serie);
                                                        }
                                                    } catch (err) {
                                                        _didIteratorError2 = true;
                                                        _iteratorError2 = err;
                                                    } finally {
                                                        try {
                                                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                                                _iterator2.return();
                                                            }
                                                        } finally {
                                                            if (_didIteratorError2) {
                                                                throw _iteratorError2;
                                                            }
                                                        }
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
                                return { data: result };
                            });
                        } else {
                            /* mono target */
                            var _this = this;
                            var url = this.url;
                            if (this.ae) url = url + '/' + this.ae;
                            var p = new Promise(function (resolve, reject) {
                                _this.doRequest({
                                    url: url + '/' + query.targets[0].target + '?' + qry,
                                    data: query,
                                    method: 'GET'
                                }).then(function (response) {
                                    if (response.status === 200) {
                                        console.log("response: ", response.data);
                                        if (response.data["m2m:cin"] && response.data["m2m:cin"].length > 0) {
                                            var data = response.data["m2m:cin"];
                                            if (query.targets[0].type == 'table') {
                                                resolve({ data: _this._respTable(data) });
                                            } else if (query.targets[0].type == 'timeserie') {
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
                }, {
                    key: "testDatasource",
                    value: function testDatasource() {
                        var url = this.url;
                        if (this.ae) url = url + '/' + this.ae;
                        return this.doRequest({
                            url: url + '?rcn=5&lim=10',
                            method: 'GET'
                        }).then(function (response) {
                            if (response.status === 200) {
                                return { status: "success", message: "Data source is working", title: "Success" };
                            }
                        });
                    }
                }, {
                    key: "annotationQuery",
                    value: function annotationQuery(options) {
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
                        }).then(function (result) {
                            return result.data;
                        });
                    }
                }, {
                    key: "metricFindQuery",
                    value: function metricFindQuery(query) {
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
                                    return { text: n, value: n };
                                }
                            });
                        });
                    }
                }, {
                    key: "metricFindFields",
                    value: function metricFindFields(query, target) {
                        //console.log("metricFindFields: ", query, target);
                        var _this = this;
                        var url = this.url;
                        if (this.ae) url = url + '/' + this.ae + '/' + target.target;
                        return this.doRequest({
                            url: url + '?rcn=5&lim=1',
                            method: 'GET'
                        }).then(function (response) {
                            if (response.status === 200) {
                                var data = response.data["m2m:cin"];
                                // search data columns
                                var cols = [];
                                for (var k in _this._getContent(data[0])) {
                                    cols.push({ text: k, value: k });
                                }
                                return cols;
                            }
                        });
                    }
                }, {
                    key: "metricGetJson",
                    value: function metricGetJson(target) {
                        //console.log("metricGetJson: ", target);
                        var url = this.url;
                        if (this.ae) url = url + '/' + this.ae + '/' + target.target;
                        return this.doRequest({
                            url: url + '?rcn=5&lim=1',
                            method: 'GET'
                        }).then(function (response) {
                            if (response.status === 200) {
                                return response.data["m2m:cin"][0].con;
                            } else {
                                return {};
                            }
                        });
                    }
                }, {
                    key: "doRequest",
                    value: function doRequest(options) {
                        options.withCredentials = this.withCredentials;
                        options.headers = this.headers;
                        options.headers['X-M2M-RI'] = new Date().getTime();

                        return this.backendSrv.datasourceRequest(options);
                    }
                }, {
                    key: "buildQueryParameters",
                    value: function buildQueryParameters(options) {
                        var _this3 = this;

                        //remove placeholder targets
                        options.targets = _.filter(options.targets, function (target) {
                            return target.target !== 'select metric';
                        });

                        var targets = _.map(options.targets, function (target) {
                            return {
                                target: _this3.templateSrv.replace(target.target, options.scopedVars, 'regex'),
                                refId: target.refId,
                                hide: target.hide,
                                type: target.type || 'timeserie',
                                field: target.field || {}
                            };
                        });

                        options.targets = targets;

                        return options;
                    }
                }, {
                    key: "_getContent",
                    value: function _getContent(cin) {
                        var con;
                        if (cin.cnf.indexOf("application/json") != -1 && typeof cin.con == 'string') {
                            try {
                                con = JSON.parse(cin.con);
                            } catch (e) {
                                console.warn("json.parse: error=", e.name, "con=", cin.con);
                                con = {};
                            }
                        } else {
                            con = {};
                        }
                        return con;
                    }
                }, {
                    key: "_utc2date",
                    value: function _utc2date(utc_str) {
                        var d = moment.utc(utc_str).toDate();
                        return d;
                    }
                }, {
                    key: "_respTable",
                    value: function _respTable(data) {
                        var out = [{ "columns": [], "rows": [], "type": "table" }];
                        // timestamp
                        out[0].columns.push({
                            "text": "Time",
                            "type": "time",
                            "sort": true,
                            "desc": true
                        });
                        // search data columns
                        var cols = [];
                        for (var k in this._getContent(data[0])) {
                            out[0].columns.push({
                                "text": k
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
                }, {
                    key: "_respTimeserie",
                    value: function _respTimeserie(data, field) {
                        var out = [{ "target": null, "datapoints": [] }];
                        if (field && field.path) {
                            out[0].target = field.name || field.path;
                            for (var k in data) {
                                var props = this._getContent(data[k]);
                                var value = _.get(props, field.path); // lodash _.get(object, path, [defaultValue])
                                out[0].datapoints.push([value, this._utc2date(data[k].ct).getTime() // convert ct UTC date to ts
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
                                    dp.push([props[field], this._utc2date(data[k].ct).getTime() // convert ct UTC date to ts
                                    ]);
                                }
                                out.push({ "target": field, "datapoints": dp });
                            }
                        }
                        console.log("timeserie: ", out);
                        return out;
                    }
                }]);

                return GenericDatasource;
            }());

            _export("GenericDatasource", GenericDatasource);
        }
    };
});
//# sourceMappingURL=datasource.js.map
