import TagParserBase from './base.js';
import { CONFIG } from '../constants.js';
import { EventOptionsModel } from '../models/index.js';

class EventOptionsTagParser extends TagParserBase {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, CONFIG.TAG_NAMES.EVENT_OPTIONS, EventOptionsModel, EventOptionsModel.getCheckAttributes());
    }
}

export default EventOptionsTagParser;