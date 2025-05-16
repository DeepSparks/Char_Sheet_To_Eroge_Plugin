import StableDiffusionWebUIImageProcessor from './stable-diffusion-webui-image-processor.js';
import NovelAIUIImageProcessor from './novel-ai-image-processor.js';

const imageProcessors = {
    'stable-diffusion-web-ui': StableDiffusionWebUIImageProcessor,
    'novel-ai': NovelAIUIImageProcessor
}

export default imageProcessors;