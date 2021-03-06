'use strict';

System.register(['app/plugins/sdk', './css/query-editor.css!'], function (_export, _context) {
    "use strict";

    var QueryCtrl, _createClass, Onem2mDatasourceQueryCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    return {
        setters: [function (_appPluginsSdk) {
            QueryCtrl = _appPluginsSdk.QueryCtrl;
        }, function (_cssQueryEditorCss) {}],
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

            _export('Onem2mDatasourceQueryCtrl', Onem2mDatasourceQueryCtrl = function (_QueryCtrl) {
                _inherits(Onem2mDatasourceQueryCtrl, _QueryCtrl);

                function Onem2mDatasourceQueryCtrl($scope, $injector) {
                    _classCallCheck(this, Onem2mDatasourceQueryCtrl);

                    var _this = _possibleConstructorReturn(this, (Onem2mDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(Onem2mDatasourceQueryCtrl)).call(this, $scope, $injector));

                    _this.scope = $scope;
                    _this.target.target = _this.target.target || 'select metric';
                    _this.target.type = _this.target.type || 'timeserie';
                    _this.target.field = _this.target.field || {};

                    _this.datasource.metricGetJson(_this.target).then(function (json_sample) {
                        console.log("   >json_sample", json_sample);
                        _this.scope.json_sample = json_sample;
                    });

                    console.log("Onem2mDatasourceQueryCtrl", _this.target);
                    return _this;
                }

                _createClass(Onem2mDatasourceQueryCtrl, [{
                    key: 'getOptions',
                    value: function getOptions(query) {
                        return this.datasource.metricFindQuery(query || '');
                    }
                }, {
                    key: 'getFields',
                    value: function getFields(query) {
                        return this.datasource.metricFindFields(query || '', this.target);
                    }
                }, {
                    key: 'toggleEditorMode',
                    value: function toggleEditorMode() {
                        this.target.rawQuery = !this.target.rawQuery;
                    }
                }, {
                    key: 'onChangeInternal',
                    value: function onChangeInternal() {
                        console.log("onChangeInternal: this.target=", this.target);
                        this.panelCtrl.refresh(); // Asks the panel to refresh data.
                    }
                }]);

                return Onem2mDatasourceQueryCtrl;
            }(QueryCtrl));

            _export('Onem2mDatasourceQueryCtrl', Onem2mDatasourceQueryCtrl);

            Onem2mDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
        }
    };
});
//# sourceMappingURL=query_ctrl.js.map
