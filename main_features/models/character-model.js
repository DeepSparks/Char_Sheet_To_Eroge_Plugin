import { TranslateInterface } from '../interfaces/index.js';

class CharacterModel {
    constructor(req_body) {
        this.name = req_body.name || '';

        this.gender = req_body.gender || this.gender || '';
        this.age = req_body.age || this.age || '';
        this.hair_style = req_body.hair_style || this.hair_style || '';
        this.hair_color = req_body.hair_color || this.hair_color || '';
        this.eye_color = req_body.eye_color || this.eye_color || '';
        this.breast_size = req_body.breast_size || this.breast_size || '';
        this.skin_color = req_body.skin_color || this.skin_color || '';
        this.etc = req_body.etc || this.etc || '';

        if(!this.hair_style.includes("hair")) this.hair_style = this.hair_style + " hair";
        if(!this.hair_color.includes("hair")) this.hair_color = this.hair_color + " hair";
        if(!this.eye_color.includes("eyes")) this.eye_color = this.eye_color + " eyes";
        if(!this.skin_color.includes("skin")) this.skin_color = this.skin_color + " skin";
        if(this.breast_size.includes("flat") && !this.breast_size.includes("chest")) this.breast_size = this.breast_size + " chest";
        if(!this.breast_size.includes("flat") && !this.breast_size.includes("breasts")) this.breast_size = this.breast_size + " breasts";

        if(/\d+/.test(this.age)) {
            const age = parseInt(this.age);
            if(age <= 8) this.age = "extremely young";
            else if(age <= 12) this.age = "very young";
            else if(age <= 20) this.age = "young";
            else if(age <= 30) this.age = "adult";
            else if(age <= 40) this.age = "middle-aged";
            else this.age = "old";
        }
    }

    static async translateReqBody(reqBody) {
        for (let key of ['age', 'hair_style', 'hair_color', 'eye_color', 'breast_size', 'skin_color', 'etc']) {
            if(/[^\x00-\x7F]/.test(reqBody[key])) {
                reqBody[key] = await TranslateInterface.translateText('auto', 'en', reqBody[key]);
                reqBody[key] = reqBody[key].toLowerCase();
            }
        }
    }

    toJsonDict() {
        return {...this};
    }

    toPrompt() {
        return [this.age, this.hair_style, this.hair_color, this.eye_color, this.breast_size, this.skin_color, this.etc].filter(attr => attr).join(', ').toLowerCase();
    }
}

export default CharacterModel;