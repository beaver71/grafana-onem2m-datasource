import {Onem2mDatasource} from './datasource';
import {Onem2mDatasourceQueryCtrl} from './query_ctrl';
import {Onem2mConfigCtrl} from './config_ctrl';

class Onem2mQueryOptionsCtrl {
}
Onem2mQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

class Onem2mAnnotationsQueryCtrl {
}
Onem2mAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html'

export {
    Onem2mDatasource as Datasource,
    Onem2mDatasourceQueryCtrl as QueryCtrl,
    Onem2mConfigCtrl as ConfigCtrl,
    Onem2mQueryOptionsCtrl as QueryOptionsCtrl,
    Onem2mAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
