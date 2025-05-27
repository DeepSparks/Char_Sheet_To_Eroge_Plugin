import BaseModel from './base.js';

class StatusModel extends BaseModel {
    constructor(attributes) {
        super(attributes);
    }

    static getCheckAttributes() {
        return ['time', 'location', 'girls'];
    }
}

export default StatusModel;
