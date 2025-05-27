import BaseModel from './base.js';

class StyleModel extends BaseModel {
    constructor(attributes) {
        super(attributes);
        this.style_id = attributes.style_id || '';
        this.clothes = attributes.clothes || '';
        this.clothes_color = attributes.clothes_color || '';
        this.bra = attributes.bra || '';
        this.bra_color = attributes.bra_color || '';
        this.panties = attributes.panties || '';
        this.panties_color = attributes.panties_color || '';
        this.etc = attributes.etc || '';
    }

    toJsonDict() {
        return { ...this };
    }

    static getCheckAttributes() {
        return ['style_id', 'clothes', 'clothes_color', 'bra', 'bra_color', 'panties', 'panties_color', 'etc'];
    }
}

export default StyleModel;
