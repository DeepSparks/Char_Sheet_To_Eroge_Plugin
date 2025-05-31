import BaseRenderer from './base.js';
import FrontConfig from '../front_config.js';
import { RandomUtil } from '../../utils/index.js';

class ImageRenderer extends BaseRenderer {
    static createImageUrl(imagePath, seed) {
        return super.createUrl(imagePath, seed);
    }

    static createSlideContext(imageUrl, content, is_end_of_content) {
        const randomSeed = RandomUtil.get_random_seed();

        const checkboxId = `hide-content-checkbox-${randomSeed}`;
        const containerId = `content-container-${randomSeed}`;

        let imageContainerClass = is_end_of_content ? "image-container" : "image-container-in-progress";
        if(FrontConfig.IS_ALWAYS_EXPAND_SCENE) {
            imageContainerClass = "image-container-in-progress";
        }
        
        return `
<style>
#${checkboxId}:checked ~ #${containerId} .content-container {
    visibility: hidden;
}
</style>

<input type="checkbox" id="${checkboxId}" class="hide-content-container-id"/>
<div class="root-container">
    <div style="width: ${FrontConfig.IMAGE_WIDTH}px;">
        <label class="hide-content-container-label" for="${checkboxId}">내용 표시</label>
    </div>
</div>

<div class="root-container" id="${containerId}">
    <div class="${imageContainerClass}" style="background-image: url(${imageUrl});">
        <div class="content-container">
            ${content}
        </div>
    </div>
</div>`;
    }
}

export default ImageRenderer;