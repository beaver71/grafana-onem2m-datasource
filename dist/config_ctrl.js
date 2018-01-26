'use strict';

System.register(['lodash', './settings.js'], function (_export, _context) {
    "use strict";

    var _, settings, _createClass, Onem2mConfigCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_lodash) {
            _ = _lodash.default;
        }, function (_settingsJs) {
            settings = _settingsJs.default;
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

            _export('Onem2mConfigCtrl', Onem2mConfigCtrl = function () {

                /** @ngInject */
                function Onem2mConfigCtrl($scope) {
                    _classCallCheck(this, Onem2mConfigCtrl);

                    // defaults
                    this.current.url = this.current.url || settings.url;
                    this.current.access = "direct";
                    this.current.basicAuth = this.current.basicAuth || true;
                    this.current.basicAuthUser = this.current.basicAuthUser || "";
                    this.current.basicAuthPassword = this.current.basicAuthPassword || "";
                    this.current.jsonData.ae = this.current.jsonData.ae || 'Select or write AE';
                    this.current.jsonData.origin = this.current.jsonData.origin || 'Origin';
                    console.log("Onem2mConfigCtrl:", this.current);
                    console.log("   >settings:", settings);
                }

                _createClass(Onem2mConfigCtrl, [{
                    key: 'aeList',
                    value: function aeList() {
                        var list = settings.ae;
                        console.log("aeList:", this.current, list);
                        return list;
                    }
                }, {
                    key: 'aeChanged',
                    value: function aeChanged() {
                        console.log("aeChanged:", this.current);
                    }
                }]);

                return Onem2mConfigCtrl;
            }());

            _export('Onem2mConfigCtrl', Onem2mConfigCtrl);

            Onem2mConfigCtrl.templateUrl = 'partials/config.html';
        }
    };
});
//# sourceMappingURL=config_ctrl.js.map
