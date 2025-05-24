import { TranslateInterface } from '../interfaces/index.js';

class StyleModel {
    constructor(req_body) {
        this.style_id = req_body.style_id || '';

        this.clothes = req_body.clothes || this.clothes || '';
        this.clothes_color = req_body.clothes_color || this.clothes_color || '';
        this.bra = req_body.bra || this.bra || '';
        this.bra_color = req_body.bra_color || this.bra_color || '';
        this.panties = req_body.panties || this.panties || '';
        this.panties_color = req_body.panties_color || this.panties_color || '';
        this.etc = req_body.etc || this.etc || '';

        if(this.bra && !this.bra.includes("bra")) this.bra = this.bra + " bra";
        if(this.bra_color && !this.bra_color.includes("bra")) this.bra_color = this.bra_color + " bra";
        if(this.panties && !this.panties.includes("panties")) this.panties = this.panties + " panties";
        if(this.panties_color && !this.panties_color.includes("panties")) this.panties_color = this.panties_color + " panties";

        if(["none bra", "no bra", ""].includes(this.bra)) {
            this.bra = "no bra";
            this.bra_color = "";
        }
        if(["none panties", "no panties", ""].includes(this.panties)) {
            this.panties = "no panties";
            this.panties_color = "";
        }
    }

    async translateKeywords() {
        for (let key of ['clothes', 'clothes_color', 'bra', 'bra_color', 'panties', 'panties_color', 'etc']) {
            if(/[^\x00-\x7F]/.test(this[key])) {
                this[key] = await TranslateInterface.translateText('auto', 'en', this[key]);
                this[key] = this[key].toLowerCase();
            }
        }
    }

    toJsonDict() {
        return {...this};
    }

    toPrompt() {
        return [this.clothes_color + " " + this.clothes, this.bra, this.bra_color, this.panties, this.panties_color, this.etc].filter(attr => attr).join(', ').toLowerCase();
    }
}

export default StyleModel;