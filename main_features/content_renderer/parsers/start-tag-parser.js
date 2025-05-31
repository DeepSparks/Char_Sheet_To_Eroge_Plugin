import TagParserBase from './base.js';
import FrontConfig from '../front_config.js';
import { StartModel } from '../models/index.js';

class StartTagParser extends TagParserBase {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, FrontConfig.TAG_NAMES.START, StartModel, StartModel.getCheckAttributes());
    }
}

export default StartTagParser;