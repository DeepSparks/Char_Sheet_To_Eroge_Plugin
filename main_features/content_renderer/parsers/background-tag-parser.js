import TagParserBase from './base.js';
import FrontConfig from '../front_config.js';
import { BackgroundModel } from '../models/index.js';

class BackgroundTagParser extends TagParserBase {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, FrontConfig.TAG_NAMES.BACKGROUND, BackgroundModel, BackgroundModel.getCheckAttributes());
    }
}

export default BackgroundTagParser;