const QUALITY_KEYWORDS = ["detailed background", "uncensored", "tsunako", "masterpiece", "best quality", "high score", "great score", "absurdres", "highres"]
const NEGATIVE_KEYWORDS = ["normal quality", "bad qualit", "worst quality", "displeasing", "very displeasing", "lowres", "blurry", "error", "film grain", "scan artifacts", "bad hands", "jpeg artifacts", "chromatic aberration", "multiple views", "logo", "too many watermarks", "censored", "aged up", "old", "white background", "simple background"]
const NEGATIVE_KEYWORDS_FOR_CHARACTER = ["lowres", "aliasing"]

class NovelAIKeywordProcessor {
    static process(imageModel) {
        const promptKeywords = []

        if(imageModel.person_keywords.length > 0)
            promptKeywords.push(...imageModel.person_keywords);

        promptKeywords.push(imageModel.common_prompt);
        promptKeywords.push(...QUALITY_KEYWORDS);

        imageModel.prompt = promptKeywords.join(', ');
        imageModel.negative_prompt = NEGATIVE_KEYWORDS.join(', ');


        const characterPrompts = []
        for(let character_prompt of imageModel.character_prompts) {
            characterPrompts.push({
                prompt: character_prompt.concat_prompt,
                negative_prompt: NEGATIVE_KEYWORDS_FOR_CHARACTER.join(', ')
            })
        }
        imageModel.character_prompts = characterPrompts;
    }
}

export default NovelAIKeywordProcessor;
