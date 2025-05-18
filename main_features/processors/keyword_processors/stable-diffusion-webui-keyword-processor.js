const QUALITY_KEYWORDS = ["uncensored", "tsunako", "masterpiece", "best quality", "high score", "great score", "absurdres", "highres"]
const NEGATIVE_KEYWORDS = ["bad anatomy, bad feet, bad hands, bad proportions, bad perspective, wrong hand, wrong foot, ugly hands, ugly arms, missing finger, extra finger, fewer digits, extra digits, extra toes, missing toes, extra arms, extra faces, multiple heads, no pussy, error, artistic error, wardrobe error, text, signature, watermark, username, blurry, cropped, lowres, worst quality, low quality, low score, bad score, average score, censored, blank censor, afterimage, motion blur, speed lines, motion lines, futanari, aged up, old, wrinkled skin"]

class StableDiffusionWebUIKeywordProcessor {
    static process(imageModel) {
        const keywords = []

        if(imageModel.person_keywords.length > 0)
            keywords.push(...imageModel.person_keywords);

        keywords.push(imageModel.common_prompt);
        keywords.push(...QUALITY_KEYWORDS);

        for(let character_prompt of imageModel.character_prompts) {
            keywords.push("BREAK")
            keywords.push(character_prompt.concat_prompt);
        }

        imageModel.prompt = keywords.join(', ');
        imageModel.negative_prompt = [...NEGATIVE_KEYWORDS, imageModel.common_negative_prompt].join(', ');
    }
}

export default StableDiffusionWebUIKeywordProcessor;
