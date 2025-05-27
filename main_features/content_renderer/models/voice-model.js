import BaseModel from './base.js';

class VoiceModel extends BaseModel {
    constructor(attributes) {
        super(attributes);
        this.name = attributes.name || '';
        this.text = attributes.text || '';
        this.happy = Number(attributes.happy) || 0;
        this.fun = Number(attributes.fun) || 0;
        this.angry = Number(attributes.angry) || 0;
        this.sad = Number(attributes.sad) || 0;
        this.crying = Number(attributes.crying) || 0;
        
        this.emotions = {
            happy: this.happy,
            fun: this.fun,
            angry: this.angry,
            sad: this.sad,
            crying: this.crying
        }
    }
    
    toJsonDict() {
        return { ...this };
    }

    static getCheckAttributes() {
        return ['name', 'text', 'happy', 'fun', 'angry', 'sad', 'crying'];
    }
}

export default VoiceModel;
