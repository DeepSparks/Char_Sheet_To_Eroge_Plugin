import GoogleTranslateProcessor from './google-translate-processor.js';
import DeepLTranslateProcessor from './deepl-translate-processor.js';

const translateProcessors = {
    'google': GoogleTranslateProcessor,
    'deepl': DeepLTranslateProcessor
}

export default translateProcessors;