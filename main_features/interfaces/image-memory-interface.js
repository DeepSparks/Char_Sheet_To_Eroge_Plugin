import { ImageModel } from '../models/index.js';
import BaseMemoryInterface from './base-memory-interface.js';

class ImageMemoryInterface extends BaseMemoryInterface {
    static getMapKey(image) {
        return image.saved_file_path;
    }

    static getModelClass() {
        return ImageModel;
    }

    static getMemoryFileName() {
        return 'image_memory.json';
    }

    
    static addImages(imageModels, resource_name) {
        return this.addItems(imageModels, resource_name);
    }

    static addImage(imageModel, resource_name) {
        return this.addItem(imageModel, resource_name);
    }

    static getImages(imageModels, resource_name) {
        return this.getItems(imageModels, resource_name);
    }

    static getImage(imageModel, resource_name) {
        return this.getItem(imageModel, resource_name);
    }

    static getAllImages(resource_name) {
        return this.getAllItems(resource_name);
    }
}

export default ImageMemoryInterface;