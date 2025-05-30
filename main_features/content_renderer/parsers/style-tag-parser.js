import TagParserBase from './base.js';
import FrontConfig from '../front_config.js';
import { StyleModel } from '../models/index.js';

class StyleTagParser extends TagParserBase {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, FrontConfig.TAG_NAMES.STYLE, StyleModel, StyleModel.getCheckAttributes());
    }
}

export default StyleTagParser;