import FrontConfig from '../front_config.js';

class BaseRenderer {
    static createUrl(contentPath, seed) {
        return `${FrontConfig.BACKEND_URL}/${contentPath}?randomSeed=${seed}`;
    }
}

export default BaseRenderer;