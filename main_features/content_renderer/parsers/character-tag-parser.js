import TagParserBase from './base.js';
import { CONFIG } from '../constants.js';
import { CharacterModel } from '../models/index.js';

class CharacterTagParser extends TagParserBase {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, CONFIG.TAG_NAMES.CHARACTER, CharacterModel, CharacterModel.getCheckAttributes());
    }
}

export default CharacterTagParser;