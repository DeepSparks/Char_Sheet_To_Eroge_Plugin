import TagParserBase from './base.js';
import { CONFIG } from '../constants.js';
import { StatusModel } from '../models/index.js';

class StatusTagParser extends TagParserBase {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, CONFIG.TAG_NAMES.STATUS, StatusModel, StatusModel.getCheckAttributes());
    }
}

export default StatusTagParser;