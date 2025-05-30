import TagParserBase from './base.js';
import FrontConfig from '../front_config.js';
import { CharacterModel } from '../models/index.js';

class CharacterTagParser extends TagParserBase {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, FrontConfig.TAG_NAMES.CHARACTER, CharacterModel, CharacterModel.getCheckAttributes());
    }
}

export default CharacterTagParser;