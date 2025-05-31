import BaseModel from './base.js';

class StatusModel extends BaseModel {
    constructor(attributes) {
        super(attributes);

        this.time_period = attributes.time_period || '';
        this.location = attributes.location || '';
        this.girls = attributes.girls || '';

        this.time_period = this.time_period.charAt(0).toUpperCase() + this.time_period.slice(1);
        this.attributes.time_period = this.time_period;
    }

    static getCheckAttributes() {
        return ['time_period', 'location', 'girls'];
    }
}

export default StatusModel;
