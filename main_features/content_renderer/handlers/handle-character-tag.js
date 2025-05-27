import { CharacterTagParser } from '../parsers/index.js';
import { CONFIG } from '../constants.js';
import BackendInterface from '../backend-interface.js';

export default async function handleCharacterTag(content) {
    const characterTagModelMap = CharacterTagParser.parseTagsFromContent(content);
    for(let tagIndex = 0; tagIndex < Object.keys(characterTagModelMap).length; tagIndex++) {
        const currentFullTag = Object.keys(characterTagModelMap)[tagIndex];
        content = content.replace(currentFullTag, "");
    }

    if(CONFIG.IS_ONLY_ALLOW_GIRL_CHARACTER) {
        for(let characterKey of Object.keys(characterTagModelMap)) {
            const character = characterTagModelMap[characterKey];
            if(character.gender !== 'girl') {
                delete characterTagModelMap[characterKey];
            }
        }
    }

    await BackendInterface.addCharacters(Object.values(characterTagModelMap));

    return content;
}