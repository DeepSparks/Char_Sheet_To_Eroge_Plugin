import { CONFIG } from '../constants.js';

class BaseRenderer {
    static createUrl(contentPath, seed) {
        return `${CONFIG.BACKEND_URL}/${contentPath}?randomSeed=${seed}`;
    }
}

export default BaseRenderer;