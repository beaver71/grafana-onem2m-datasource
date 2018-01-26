import _ from 'lodash';

export class Onem2mConfigCtrl{
    
    /** @ngInject */
    constructor($scope) {
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

    aeList() {
        var list = [
            {text: 'autopilot', value: 'autopilot'},
            {text: 'blockchain', value: 'blockchain'},
            {text: 'cnit', value: 'cnit'},
            {text: 'cosmo', value: 'cosmo'},
            {text: 'ecogest', value: 'ecogest'},
            {text: 'eeb', value: 'eeb'},
            {text: 'firenze', value: 'firenze'},
            {text: 'livorno', value: 'livorno'},
            {text: 'monica', value: 'monica'},
            {text: 'nbiot', value: 'nbiot'},
            {text: 'nttdata', value: 'nttdata'},
            {text: 'oal', value: 'oal'},
            {text: 'publicsafety', value: 'publicsafety'},
            {text: 'tester', value: 'tester'},
            {text: 'waterview', value: 'waterview'},
        ];
        console.log("aeList:", this.current, list);
        return list;
    }
    
    aeChanged() {
        console.log("aeChanged:",this.current);
    }

}

Onem2mConfigCtrl.templateUrl = 'partials/config.html';