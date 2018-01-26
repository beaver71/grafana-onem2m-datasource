'use strict';

System.register(['./datasource', './query_ctrl', './config_ctrl'], function (_export, _context) {
    "use strict";

    var Onem2mDatasource, Onem2mDatasourceQueryCtrl, Onem2mConfigCtrl, Onem2mQueryOptionsCtrl, Onem2mAnnotationsQueryCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_datasource) {
            Onem2mDatasource = _datasource.Onem2mDatasource;
        }, function (_query_ctrl) {
            Onem2mDatasourceQueryCtrl = _query_ctrl.Onem2mDatasourceQueryCtrl;
        }, function (_config_ctrl) {
            Onem2mConfigCtrl = _config_ctrl.Onem2mConfigCtrl;
        }],
        execute: function () {
            _export('QueryOptionsCtrl', Onem2mQueryOptionsCtrl = function Onem2mQueryOptionsCtrl() {
                _classCallCheck(this, Onem2mQueryOptionsCtrl);
            });

            Onem2mQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

            _export('AnnotationsQueryCtrl', Onem2mAnnotationsQueryCtrl = function Onem2mAnnotationsQueryCtrl() {
                _classCallCheck(this, Onem2mAnnotationsQueryCtrl);
            });

            Onem2mAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';

            _export('Datasource', Onem2mDatasource);

            _export('QueryCtrl', Onem2mDatasourceQueryCtrl);

            _export('ConfigCtrl', Onem2mConfigCtrl);

            _export('QueryOptionsCtrl', Onem2mQueryOptionsCtrl);

            _export('AnnotationsQueryCtrl', Onem2mAnnotationsQueryCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map
