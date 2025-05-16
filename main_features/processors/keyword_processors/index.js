import StableDiffusionWebUIKeywordProcessor from './stable-diffusion-webui-keyword-processor.js';
import VoiceVoxKeywordProcessor from './voice-vox-keyword-processor.js';
import NovelAIKeywordProcessor from './novel-ai-keyword-processor.js';

const keywordProcessors = {
    'stable-diffusion-web-ui': StableDiffusionWebUIKeywordProcessor,
    'voice-vox': VoiceVoxKeywordProcessor,
    'novel-ai': NovelAIKeywordProcessor
}

export default keywordProcessors;
