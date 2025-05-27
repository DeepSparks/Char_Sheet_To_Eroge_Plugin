class BaseModel {
    constructor(attributes) {
        this.attributes = attributes || {};
    }

    toJsonDict() {
        return { ...this.attributes };
    }

    toPromptString() {
        return Object.values(this.toJsonDict()).filter(attr => attr).join(', ');
    }
}

export default BaseModel;
