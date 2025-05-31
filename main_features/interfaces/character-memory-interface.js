import { CharacterModel } from '../models/index.js';
import BaseMemoryInterface from './base-memory-interface.js';

class CharacterMemoryInterface extends BaseMemoryInterface {
    static getMapKey(character) {
        return character.name;
    }

    static getModelClass() {
        return CharacterModel;
    }

    static getMemoryFileName() {
        return 'character_memory.json';
    }

    
    static addCharacters(characters, resource_name) {
        return this.addItems(characters, resource_name);
    }

    static addCharacter(character, resource_name) {
        return this.addItem(character, resource_name);
    }

    static getCharacters(characters, resource_name) {
        return this.getItems(characters, resource_name);
    }

    static getCharacter(character, resource_name) {
        return this.getItem(character, resource_name);
    }

    static getAllCharacters(resource_name) {
        return this.getAllItems(resource_name);
    }
}

export default CharacterMemoryInterface;