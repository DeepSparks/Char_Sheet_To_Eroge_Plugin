import { StyleModel } from '../models/index.js';
import BaseMemoryInterface from './base-memory-interface.js';

class StyleMemoryInterface extends BaseMemoryInterface {
    static getMapKey(style) {
        return style.style_id;
    }

    static getModelClass() {
        return StyleModel;
    }

    static getMemoryFileName() {
        return 'style_memory.json';
    }


    static async addStyles(styles, resource_name) {
        return this.addItems(styles, resource_name);
    }

    static async addStyle(style, resource_name) {
        return this.addItem(style, resource_name);
    }

    static getStyles(styles, resource_name) {
        return this.getItems(styles, resource_name);
    }

    static getStyle(style, resource_name) {
        return this.getItem(style, resource_name);
    }
}

export default StyleMemoryInterface;