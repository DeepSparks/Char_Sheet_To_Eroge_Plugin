import BaseModel from './base.js';

class EventOptionsModel extends BaseModel {
    constructor(attributes) {
        super(attributes);
    }

    static getCheckAttributes() {
        return ['first', 'second', 'third'];
    }
}

export default EventOptionsModel;