import Utils from '../utils.js';
import { imageProcessors } from '../processors/index.js';
import Config from '../config.js';
import BaseQueueUtil from './base_queue_util.js';

class ImageQueueUtil extends BaseQueueUtil {
    static requestQueue = []
    static alreadyWorkIds = new Set();

    static async processRequest(request) {
        Utils.logToFile(`Processing request by image queue util, request: ${JSON.stringify(request)}`, 'info');
        if (request.type === 'image') {
            await this.process_image_request(request.data);
        }
    }

    static async process_image_request(imageModel) {
        if(!Utils.is_image_waiting(imageModel.toFilePath()))
            return;

        await imageProcessors[Config.IMAGE_GENERATION_MODE].process(imageModel);
    }
}

export default ImageQueueUtil;
