import { BackgroundModel } from '../models/index.js';
import BaseMemoryInterface from './base-memory-interface.js';

class BackgroundMemoryInterface extends BaseMemoryInterface {
    static getMapKey(background) {
        return background.background_id;
    }

    static getModelClass() {
        return BackgroundModel;
    }

    static getMemoryFileName() {
        return 'background_memory.json';
    }


    static async addBackgrounds(backgrounds, resource_name) {
        return this.addItems(backgrounds, resource_name);
    }

    static async addBackground(background, resource_name) {
        return this.addItem(background, resource_name);
    }

    static getBackgrounds(backgrounds, resource_name) {
        return this.getItems(backgrounds, resource_name);
    }

    static getBackground(background, resource_name) {
        return this.getItem(background, resource_name);
    }
}

export default BackgroundMemoryInterface;