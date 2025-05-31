import { CharacterTagParser } from '../parsers/index.js';
import FrontConfig from '../front_config.js';
import BackendInterface from '../backend-interface.js';

export default async function handleCharacterTag(content, resource_name) {
    const characterTagModelMap = CharacterTagParser.parseTagsFromContent(content);
    for(let tagIndex = 0; tagIndex < Object.keys(characterTagModelMap).length; tagIndex++) {
        const currentFullTag = Object.keys(characterTagModelMap)[tagIndex];
        content = content.replace(currentFullTag, "");
    }

    if(!FrontConfig.IS_ALLOW_MALE_CHARACTER) {
        for(let characterKey of Object.keys(characterTagModelMap)) {
            const character = characterTagModelMap[characterKey];
            if(character.gender !== 'girl') {
                delete characterTagModelMap[characterKey];
            }
        }
    }

    await BackendInterface.addCharacters(Object.values(characterTagModelMap), resource_name);

    return {
        content: content,
        processed_characters: Object.values(characterTagModelMap)
    }
}