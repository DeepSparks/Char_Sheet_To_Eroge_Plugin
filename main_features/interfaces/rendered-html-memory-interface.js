import { RenderedHTMLModel } from '../models/index.js';
import BaseMemoryInterface from './base-memory-interface.js';

class RenderedHTMLMemoryInterface extends BaseMemoryInterface {
    static getMapKey(renderedHTML) {
        return renderedHTML.sequence_id;
    }

    static getModelClass() {
        return RenderedHTMLModel;
    }

    static getMemoryFileName() {
        return 'rendered_html_memory.json';
    }


    static async addRenderedHTMLs(renderedHTMLs, resource_name) {
        return this.addItems(renderedHTMLs, resource_name);
    }

    static async addRenderedHTML(renderedHTML, resource_name) {
        return this.addItem(renderedHTML, resource_name);
    }

    static getRenderedHTMLs(renderedHTMLs, resource_name) {
        return this.getItems(renderedHTMLs, resource_name);
    }

    static getRenderedHTML(renderedHTML, resource_name) {
        return this.getItem(renderedHTML, resource_name);
    }

    static getAllRenderedHTMLs(resource_name) {
        return this.getAllItems(resource_name);
    }
}

export default RenderedHTMLMemoryInterface;