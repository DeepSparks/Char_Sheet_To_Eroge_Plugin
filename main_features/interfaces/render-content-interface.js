import { ContentRenderer } from '../content_renderer/index.js';

class RenderContentInterface {
    static async renderContent(content) {
        return ContentRenderer.renderContent(content);
    }
}

export default RenderContentInterface;