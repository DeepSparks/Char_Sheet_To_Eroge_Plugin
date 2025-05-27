import BaseModel from './base.js';

class CharacterModel extends BaseModel {
    constructor(attributes) {
        super(attributes);
        this.name = attributes.name || '';
        this.gender = attributes.gender || '';
        this.age = attributes.age || '';
        this.hair_style = attributes.hair_style || '';
        this.hair_color = attributes.hair_color || '';
        this.eye_color = attributes.eye_color || '';
        this.breast_size = attributes.breast_size || '';
        this.skin_color = attributes.skin_color || '';
        this.voice_type = attributes.voice_type || '';
        this.etc = attributes.etc || '';
    }

    toJsonDict() {
        return { ...this };
    }

    static getCheckAttributes() {
        return ['name', 'gender', 'age', 'hair_style', 'hair_color', 'eye_color', 'breast_size', 'skin_color', 'voice_type', 'etc'];
    }
}

export default CharacterModel;
