import fs from 'fs';

import { CharacterModel } from '../models/index.js';
import Utils from '../utils.js';

const characterMemoryFilePath = 'outputs/memories/character_memory.json'

class CharacterMemoryInterface {
    static characterMap = {};
    static isUpdating = false;


    static async addCharacters(characters) {
        const processedCharacters = [];

        try{
            CharacterMemoryInterface.isUpdating = true;
            CharacterMemoryInterface.loadCharacterMap();

            for(let character of characters) {
                const characterModel = new CharacterModel(character);
                await characterModel.makePrompt();
                CharacterMemoryInterface.characterMap[CharacterMemoryInterface.getCharacterMapKey(character)] = characterModel.toJsonDict();
                processedCharacters.push(CharacterMemoryInterface.characterMap[CharacterMemoryInterface.getCharacterMapKey(character)]);
            }
            
            CharacterMemoryInterface.saveCharacterMap();
            CharacterMemoryInterface.isUpdating = false;
        } catch (error) {
            CharacterMemoryInterface.isUpdating = false;
            throw error;
        }

        return processedCharacters;
    }

    static async addCharacter(character) {
        try{
            CharacterMemoryInterface.isUpdating = true;
            CharacterMemoryInterface.loadCharacterMap();

            const characterModel = new CharacterModel(character);
            await characterModel.makePrompt();
            CharacterMemoryInterface.characterMap[CharacterMemoryInterface.getCharacterMapKey(character)] = characterModel.toJsonDict();

            CharacterMemoryInterface.saveCharacterMap();
            CharacterMemoryInterface.isUpdating = false;
        } catch (error) {
            CharacterMemoryInterface.isUpdating = false;
            throw error;
        }

        return CharacterMemoryInterface.characterMap[CharacterMemoryInterface.getCharacterMapKey(character)];
    }


    static getCharacters(characters) {
        if(!CharacterMemoryInterface.isUpdating) {
            CharacterMemoryInterface.loadCharacterMap();
        }

        return characters.map(character => {
            if(!CharacterMemoryInterface.characterMap[CharacterMemoryInterface.getCharacterMapKey(character)]) return null;
            return new CharacterModel(CharacterMemoryInterface.characterMap[CharacterMemoryInterface.getCharacterMapKey(character)]);
        }).filter(character => character !== null);
    }

    static getCharacter(character) {
        if(!CharacterMemoryInterface.isUpdating) {
            CharacterMemoryInterface.loadCharacterMap();
        }

        if(!CharacterMemoryInterface.characterMap[CharacterMemoryInterface.getCharacterMapKey(character)]) return null;
        return new CharacterModel(CharacterMemoryInterface.characterMap[CharacterMemoryInterface.getCharacterMapKey(character)]);
    }


    static loadCharacterMap() {
        let characterMap = {};
        if (fs.existsSync(characterMemoryFilePath)) {
            try {
                characterMap = JSON.parse(fs.readFileSync(characterMemoryFilePath, 'utf8'));
            } catch (error) {
                Utils.logToFile('Character memory file read error. New character memory file will be created. : ' + error, 'error');
            }
        }
        CharacterMemoryInterface.characterMap = characterMap;
    }

    static saveCharacterMap() {
        fs.writeFileSync(characterMemoryFilePath, JSON.stringify(CharacterMemoryInterface.characterMap, null, 2));
    }

    static getCharacterMapKey(character) {
        return character.name
    }
}

export default CharacterMemoryInterface;