import fs from 'fs';

import { CharacterModel } from '../models/index.js';
import Utils from '../utils.js';

class CharacterMemoryInterface {
    static addCharacters(characters, resource_name) {
        const processedCharacters = [];

        let characterMap = CharacterMemoryInterface.loadCharacterMap(resource_name);
        for(let character of characters) {
            const characterModel = new CharacterModel(character);
            characterMap[CharacterMemoryInterface.getCharacterMapKey(character)] = characterModel.toJsonDict();
            processedCharacters.push(characterMap[CharacterMemoryInterface.getCharacterMapKey(character)]);
        }
        CharacterMemoryInterface.saveCharacterMap(characterMap, resource_name);

        return processedCharacters;
    }

    static addCharacter(character, resource_name) {
        let characterMap = CharacterMemoryInterface.loadCharacterMap(resource_name);

        const characterModel = new CharacterModel(character);
        characterMap[CharacterMemoryInterface.getCharacterMapKey(character)] = characterModel.toJsonDict();

        CharacterMemoryInterface.saveCharacterMap(characterMap, resource_name);

        return characterMap[CharacterMemoryInterface.getCharacterMapKey(character)];
    }


    static getCharacters(characters, resource_name) {
        let characterMap = CharacterMemoryInterface.loadCharacterMap(resource_name);

        return characters.map(character => {
            if(!characterMap[CharacterMemoryInterface.getCharacterMapKey(character)]) return null;
            return new CharacterModel(characterMap[CharacterMemoryInterface.getCharacterMapKey(character)]);
        }).filter(character => character !== null);
    }

    static getCharacter(character, resource_name) {
        let characterMap = CharacterMemoryInterface.loadCharacterMap(resource_name);

        if(!characterMap[CharacterMemoryInterface.getCharacterMapKey(character)]) return null;
        return new CharacterModel(characterMap[CharacterMemoryInterface.getCharacterMapKey(character)]);
    }


    static loadCharacterMap(resource_name) {
        let characterMap = {};
        if (fs.existsSync(CharacterMemoryInterface.getCharacterMemoryFilePath(resource_name))) {
            try {
                characterMap = JSON.parse(fs.readFileSync(CharacterMemoryInterface.getCharacterMemoryFilePath(resource_name), 'utf8'));
            } catch (error) {
                Utils.logToFile('Character memory file read error. New character memory file will be created. : ' + error, 'error');
            }
        }
        return characterMap;
    }

    static saveCharacterMap(characterMap, resource_name) {
        fs.writeFileSync(CharacterMemoryInterface.getCharacterMemoryFilePath(resource_name), JSON.stringify(characterMap, null, 2));
    }


    static getCharacterMapKey(character) {
        return character.name
    }

    static getCharacterMemoryFilePath(resource_name) {
        if(!resource_name) resource_name = 'global';
        const memory_file_dir = `outputs/${resource_name}/memories`
        const memory_file_path = `${memory_file_dir}/character_memory.json`
        
        Utils.make_dir_if_not_exists(memory_file_dir);
        return memory_file_path
    }
}

export default CharacterMemoryInterface;