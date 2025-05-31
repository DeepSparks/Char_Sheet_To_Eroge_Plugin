import BackendInterface from '../backend-interface.js';
import RenderedHTMLModel from '../models/rendered-html-model.js';

class RenderedHTMLProcessor {
    static async addContentToRenderedHTML(content, resource_name, sequence_id) {
        const rendered_html_model = new RenderedHTMLModel({
            sequence_id: sequence_id,
            renderedHTML: content
        })
        await BackendInterface.addRenderedHTMLs([rendered_html_model], resource_name);
        return content;
    }
}

export default RenderedHTMLProcessor;