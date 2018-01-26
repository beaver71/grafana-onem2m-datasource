"use strict";

System.register(["lodash"], function (_export, _context) {
    "use strict";

    var _, _createClass, Onem2mConfigCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_lodash) {
            _ = _lodash.default;
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

            _export("Onem2mConfigCtrl", Onem2mConfigCtrl = function () {

                /** @ngInject */
                function Onem2mConfigCtrl($scope) {
                    _classCallCheck(this, Onem2mConfigCtrl);

                    // defaults
                    this.current.url = this.current.url || "https://icon-lab.tim.it/onem2m";
                    this.current.access = "direct";
                    this.current.basicAuth = this.current.basicAuth || true;
                    this.current.basicAuthUser = this.current.basicAuthUser || "";
                    this.current.basicAuthPassword = this.current.basicAuthPassword || "";
                    this.current.jsonData.ae = this.current.jsonData.ae || 'Select or write AE';
                    this.current.jsonData.origin = this.current.jsonData.origin || 'Origin';
                    console.log("Onem2mConfigCtrl:", this.current);
                }

                _createClass(Onem2mConfigCtrl, [{
                    key: "aeList",
                    value: function aeList() {
                        var list = [{ text: 'autopilot', value: 'autopilot' }, { text: 'blockchain', value: 'blockchain' }, { text: 'cnit', value: 'cnit' }, { text: 'cosmo', value: 'cosmo' }, { text: 'ecogest', value: 'ecogest' }, { text: 'eeb', value: 'eeb' }, { text: 'firenze', value: 'firenze' }, { text: 'livorno', value: 'livorno' }, { text: 'monica', value: 'monica' }, { text: 'nbiot', value: 'nbiot' }, { text: 'nttdata', value: 'nttdata' }, { text: 'oal', value: 'oal' }, { text: 'publicsafety', value: 'publicsafety' }, { text: 'tester', value: 'tester' }, { text: 'waterview', value: 'waterview' }];
                        console.log("aeList:", this.current, list);
                        return list;
                    }
                }, {
                    key: "aeChanged",
                    value: function aeChanged() {
                        console.log("aeChanged:", this.current);
                    }
                }]);

                return Onem2mConfigCtrl;
            }());

            _export("Onem2mConfigCtrl", Onem2mConfigCtrl);

            Onem2mConfigCtrl.templateUrl = 'partials/config.html';
        }
    };
});
//# sourceMappingURL=config_ctrl.js.map
