import { ContentRender } from '../renders/index.js';

class RenderContentInterface {
    static async renderContent(content) {
        return ContentRender.renderContent(content);
    }
}

export default RenderContentInterface;