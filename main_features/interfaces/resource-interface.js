import fs from 'fs';

class ResourceInterface {
    static getResourceNames() {
        const resourceNames = fs.readdirSync('./outputs');
        return resourceNames;
    }
}

export default ResourceInterface;