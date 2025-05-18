import { CharacterMemoryInterface } from '../interfaces/index.js';

class CharacterModel {
    constructor(req_body) {
        this.name = req_body.name || '';
        this.style_id = req_body.style_id || '';
        this.copy_style_id = req_body.copy_style_id || '';
  
        if(this.copy_style_id) {
            this.copyStyle({
                name: this.name,
                style_id: this.copy_style_id
            });
            this.copy_style_id = '';
        }

        this.gender = req_body.gender || this.gender || '';
        this.age = req_body.age || this.age || '';
        this.hair_style = req_body.hair_style || this.hair_style || '';
        this.hair_color = req_body.hair_color || this.hair_color || '';
        this.eye_color = req_body.eye_color || this.eye_color || '';
        this.breast_size = req_body.breast_size || this.breast_size || '';
        this.skin_color = req_body.skin_color || this.skin_color || '';
        this.clothes = req_body.clothes || this.clothes || '';
        this.clothes_color = req_body.clothes_color || this.clothes_color || '';
        this.bra = req_body.bra || this.bra || '';
        this.bra_color = req_body.bra_color || this.bra_color || '';
        this.panties = req_body.panties || this.panties || '';
        this.panties_color = req_body.panties_color || this.panties_color || '';
        this.etc = req_body.etc || this.etc || '';

        if(!this.hair_style.includes("hair")) this.hair_style = this.hair_style + " hair";
        if(!this.hair_color.includes("hair")) this.hair_color = this.hair_color + " hair";
        if(!this.eye_color.includes("eyes")) this.eye_color = this.eye_color + " eyes";
        if(!this.skin_color.includes("skin")) this.skin_color = this.skin_color + " skin";
        if(this.breast_size.includes("flat") && !this.breast_size.includes("chest")) this.breast_size = this.breast_size + " chest";
        if(!this.breast_size.includes("flat") && !this.breast_size.includes("breasts")) this.breast_size = this.breast_size + " breasts";
        if(!this.bra.includes("bra")) this.bra = this.bra + " bra";
        if(!this.bra_color.includes("bra")) this.bra_color = this.bra_color + " bra";
        if(!this.panties.includes("panties")) this.panties = this.panties + " panties";
        if(!this.panties_color.includes("panties")) this.panties_color = this.panties_color + " panties";
    }

    copyStyle(character) {
        const copy_style = CharacterMemoryInterface.getCharacter(character);
        if(copy_style) {
            this.gender = copy_style.gender;
            this.age = copy_style.age;
            this.hair_style = copy_style.hair_style;
            this.hair_color = copy_style.hair_color;
            this.eye_color = copy_style.eye_color;
            this.breast_size = copy_style.breast_size;
            this.skin_color = copy_style.skin_color;
            this.clothes = copy_style.clothes;
            this.clothes_color = copy_style.clothes_color;
            this.bra = copy_style.bra;
            this.bra_color = copy_style.bra_color;
            this.panties = copy_style.panties;
            this.panties_color = copy_style.panties_color;
            this.etc = copy_style.etc;
        }
    }

    toJsonDict() {
        return {...this};
    }

    toPrompt() {
        return [this.gender, this.age, this.hair_style, this.hair_color, this.eye_color, this.breast_size, this.skin_color, this.clothes_color + " " + this.clothes, this.bra, this.bra_color, this.panties, this.panties_color, this.etc].filter(attr => attr).join(', ');
    }
}

export default CharacterModel;