import _ from 'lodash';

import settings from './settings.js';

export class Onem2mConfigCtrl{
    
    /** @ngInject */
    constructor($scope) {
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

    aeList() {
        var list = settings.ae;
        console.log("aeList:", this.current, list);
        return list;
    }
    
    aeChanged() {
        console.log("aeChanged:",this.current);
    }

}

Onem2mConfigCtrl.templateUrl = 'partials/config.html';