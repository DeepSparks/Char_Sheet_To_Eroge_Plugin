import StableDiffusionWebUIKeywordProcessor from './stable-diffusion-webui-keyword-processor.js';
import VoiceVoxKeywordProcessor from './voice-vox-keyword-processor.js';
import NovelAIKeywordProcessor from './novel-ai-keyword-processor.js';
import VoicePeakKeywordProcessor from './voice-peak-keyword-processor.js';

const keywordProcessors = {
    'stable-diffusion-web-ui': StableDiffusionWebUIKeywordProcessor,
    'voice-vox': VoiceVoxKeywordProcessor,
    'novel-ai': NovelAIKeywordProcessor,
    'voice-peak': VoicePeakKeywordProcessor
}

export default keywordProcessors;
