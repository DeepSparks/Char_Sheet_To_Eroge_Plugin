import fs from 'fs';

import { GlobalQueueUtil, ImageQueueUtil } from '../queue_utils/index.js';
import Utils from '../utils.js';
import { ImageModel } from '../models/index.js';
import Config from '../config.js';

class ImageGenerateInterface {
    static async generateImages(imageModels) {
        const urls = [];
        for (const imageModel of imageModels) {
            const url = await this.generateImage(new ImageModel(imageModel));
            urls.push(url);
        }
        return urls;
    }
    
    static async generateImage(imageModel) {
        if(!Config.IMAGE_GENERATION_SERVER_URL) {
            Utils.logToFile('Image Generation Server url is not set. Please set it in the config.js file.', 'error');
            return null;
        }

        if(!fs.existsSync(imageModel.toFilePath())) {
            fs.copyFileSync(Config.IMAGE_WAITING_FILE_PATH, imageModel.toFilePath());
        }

        if(Config.IS_USE_GLOBAL_QUEUE) {
            GlobalQueueUtil.addRequest({
                type: 'image',
                data: imageModel
            });
        } else {
            ImageQueueUtil.addRequest({
                type: 'image',
                data: imageModel
            });
        }

        return imageModel.toFilePath();
    }

    static async waitUntilImagesGenerated(imageModels) {
        const urls = [];
        for (const imageModel of imageModels) {
            const filePath = (new ImageModel(imageModel)).toFilePath();
            while (!fs.existsSync(filePath) || Utils.is_image_waiting(filePath)) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            urls.push(filePath);
        }
        return urls;
    }
}

export default ImageGenerateInterface;