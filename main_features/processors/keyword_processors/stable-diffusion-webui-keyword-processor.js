import Config from '../../config.js';

const QUALITY_KEYWORDS = Config.LOCAL_AI_QUALITY_KEYWORDS
const NEGATIVE_KEYWORDS = Config.LOCAL_AI_NEGATIVE_KEYWORDS

class StableDiffusionWebUIKeywordProcessor {
    static process(imageModel) {
        const promptKeywords = []

        promptKeywords.push(imageModel.person_prompt);
        promptKeywords.push(imageModel.common_prompt);
        promptKeywords.push(imageModel.concat_character_prompt);
        promptKeywords.push("{{" + QUALITY_KEYWORDS.join(', ') + "}}");

        imageModel.prompt = promptKeywords.join(', ');
        imageModel.negative_prompt = "{{" + [...NEGATIVE_KEYWORDS, imageModel.common_negative_prompt].join(', ') + "}}";
    }
}

export default StableDiffusionWebUIKeywordProcessor;
