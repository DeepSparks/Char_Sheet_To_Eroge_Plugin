const QUALITY_KEYWORDS = ["detailed background", "uncensored", "tsunako", "masterpiece", "best quality", "high score", "great score", "absurdres", "highres", "game_cg"]
const NEGATIVE_KEYWORDS = ["normal quality", "bad quality", "low quality", "worst quality", "lowres", "displeasing", "bad anatomy", "bad perspective", "bad proportions", "bad face", "bad arm", "bad hands", "bad leg", "bad feet", "bad reflection", "bad link", "bad source", "wrong hand", "wrong feet", "missing", "missing limb", "missing eye", "missing tooth", "missing ear", "missing finger", "extra", "extra faces", "extra eyes", "extra mouth", "extra ears", "extra breasts", "extra arms", "extra hands", "extra legs", "extra digits", "fewer digits", "cropped", "cropped head", "cropped torso", "cropped arms", "cropped legs", "JPEG artifacts", "signature", "watermark", "username", "blurry", "artist name", "fat", "duplicate", "mutation", "deformed", "disfigured", "long neck", "unfinished", "chromatic aberration", "scan", "scan artifacts", "abstract", "@_@", "brown skin", "glasses", "vertical lines", "vertical banding", "multiple views", "simple background", "aged up", "old"]
const NEGATIVE_KEYWORDS_FOR_CHARACTER = ["lowres", "aliasing"]

class NovelAIKeywordProcessor {
    static process(imageModel) {
        const promptKeywords = []

        if(imageModel.person_keywords.length > 0)
            promptKeywords.push(...imageModel.person_keywords);

        promptKeywords.push(imageModel.common_prompt);
        promptKeywords.push(...QUALITY_KEYWORDS);

        imageModel.prompt = promptKeywords.join(', ');
        imageModel.negative_prompt = "{{" + [...NEGATIVE_KEYWORDS, imageModel.common_negative_prompt].join(', ') + "}}";


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