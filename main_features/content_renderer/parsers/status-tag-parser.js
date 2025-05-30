import TagParserBase from './base.js';
import FrontConfig from '../front_config.js';
import { StatusModel } from '../models/index.js';

class StatusTagParser extends TagParserBase {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, FrontConfig.TAG_NAMES.STATUS, StatusModel, StatusModel.getCheckAttributes());
    }
}

export default StatusTagParser;