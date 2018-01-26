import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'

export class Onem2mDatasourceQueryCtrl extends QueryCtrl {

    constructor($scope, $injector) {
        super($scope, $injector);

        this.scope = $scope;
        this.target.target = this.target.target || 'select metric';
        this.target.type = this.target.type || 'timeserie';
        this.target.field = this.target.field || {};
        
        this.datasource.metricGetJson(this.target).then(json_sample => {
            console.log("   >json_sample", json_sample);
            this.scope.json_sample = json_sample;
        });
        
        console.log("Onem2mDatasourceQueryCtrl", this.target);
    }

    getOptions(query) {
        return this.datasource.metricFindQuery(query || '');
    }

    getFields(query) {
        return this.datasource.metricFindFields(query || '', this.target);
    }

    toggleEditorMode() {
        this.target.rawQuery = !this.target.rawQuery;
    }

    onChangeInternal() {
        console.log("onChangeInternal: this.target=", this.target);
        this.panelCtrl.refresh(); // Asks the panel to refresh data.
    }
}

Onem2mDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';

