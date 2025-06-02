import BaseModel from './base.js';

class BackgroundModel extends BaseModel {
    constructor(attributes) {
        super(attributes);
        this.background_id = attributes.background_id || '';
        this.setting_type = attributes.setting_type || '';
        this.location = attributes.location || '';
        this.time_period = attributes.time_period || '';
        this.season = attributes.season || '';
        this.weather = attributes.weather || '';
        this.special_features = attributes.special_features || '';
        this.etc = attributes.etc || '';

        if(this.time_period === "afternoon") this.time_period = "morning, blue sky";
        if(this.time_period === "evening") this.time_period = "dusk";
        if(this.time_period === "midnight") this.time_period = "night";
    }

    toJsonDict() {
        return { ...this };
    }

    static getCheckAttributes() {
        return ['background_id', 'setting_type', 'location', 'time_period', 'season', 'weather', 'special_features', 'etc'];
    }
}

export default BackgroundModel;