import ContentProcessorBase from './base.js';
import BackendInterface from '../backend-interface.js';

class ImageProcessor extends ContentProcessorBase {
    static async fetchOrGenerateImages(imageTagModelMap, is_end_of_content, imageCache) {
        return this.fetchOrGenerate(
            imageTagModelMap, 
            is_end_of_content, 
            imageCache, 
            BackendInterface.generateImages.bind(BackendInterface),
            BackendInterface.checkImageCompletions.bind(BackendInterface)
        );
    }
}

export default ImageProcessor;