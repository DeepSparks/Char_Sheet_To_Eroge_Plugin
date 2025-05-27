import TagParserBase from './base.js';
import { CONFIG } from '../constants.js';
import { StyleModel } from '../models/index.js';

class StyleTagParser extends TagParserBase {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, CONFIG.TAG_NAMES.STYLE, StyleModel, StyleModel.getCheckAttributes());
    }
}

export default StyleTagParser;