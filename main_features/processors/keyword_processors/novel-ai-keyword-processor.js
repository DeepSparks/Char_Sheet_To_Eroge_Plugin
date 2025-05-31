import Config from '../../config.js';

const QUALITY_KEYWORDS = Config.NOVELAI_QUALITY_KEYWORDS
const NEGATIVE_KEYWORDS = Config.NOVELAI_NEGATIVE_KEYWORDS
const NEGATIVE_KEYWORDS_FOR_CHARACTER = Config.NOVELAI_NEGATIVE_KEYWORDS_FOR_CHARACTER

class NovelAIKeywordProcessor {
    static process(imageModel) {
        const promptKeywords = []

        promptKeywords.push(imageModel.person_prompt);
        promptKeywords.push(imageModel.common_prompt);
        promptKeywords.push("-1::censored::");
        promptKeywords.push("{{" + QUALITY_KEYWORDS.join(', ') + "}}");

        imageModel.prompt = promptKeywords.join(', ');
        imageModel.negative_prompt = "{{" + [...NEGATIVE_KEYWORDS, imageModel.common_negative_prompt].join(', ') + "}}";
        imageModel.character_prompts = [{
            prompt: imageModel.gender + ", " + imageModel.concat_character_prompt,
            negative_prompt: "{{" + NEGATIVE_KEYWORDS_FOR_CHARACTER.join(', ') + "}}"
        }]
    }
}

export default NovelAIKeywordProcessor;