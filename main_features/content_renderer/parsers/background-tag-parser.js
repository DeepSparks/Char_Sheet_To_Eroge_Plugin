import TagParserBase from './base.js';
import { CONFIG } from '../constants.js';
import { BackgroundModel } from '../models/index.js';

class BackgroundTagParser extends TagParserBase {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, CONFIG.TAG_NAMES.BACKGROUND, BackgroundModel, BackgroundModel.getCheckAttributes());
    }
}

export default BackgroundTagParser;