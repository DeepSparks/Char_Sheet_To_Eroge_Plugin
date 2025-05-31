import BaseModel from './base.js';

class StartModel extends BaseModel {
    constructor(attributes) {
        super(attributes);
        this.fixed_words = attributes.fixed_words || '';
        this.sequence = attributes.sequence || '';
    }

    toJsonDict() {
        return { ...this };
    }

    static getCheckAttributes() {
        return ['fixed_words', 'sequence'];
    }
}

export default StartModel;
