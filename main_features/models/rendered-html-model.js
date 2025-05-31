class RenderedHTMLModel {
    constructor(req_body) {
        this.sequence_id = req_body.sequence_id || '';
        this.renderedHTML = req_body.renderedHTML || '';
    }

    toJsonDict() {
        return {...this};
    }
}

export default RenderedHTMLModel;