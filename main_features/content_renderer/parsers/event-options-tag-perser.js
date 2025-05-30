import TagParserBase from './base.js';
import FrontConfig from '../front_config.js';
import { EventOptionsModel } from '../models/index.js';

class EventOptionsTagParser extends TagParserBase {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, FrontConfig.TAG_NAMES.EVENT_OPTIONS, EventOptionsModel, EventOptionsModel.getCheckAttributes());
    }
}

export default EventOptionsTagParser;