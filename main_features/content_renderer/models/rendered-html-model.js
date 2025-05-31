import BaseModel from './base.js';

class RenderedHTMLModel extends BaseModel {
    constructor(req_body) {
        super(req_body);
        this.sequence_id = req_body.sequence_id || '';
        this.renderedHTML = req_body.renderedHTML || '';
    }

    toJsonDict() {
        return {...this};
    }
}

export default RenderedHTMLModel;