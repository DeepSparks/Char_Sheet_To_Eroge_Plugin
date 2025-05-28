const QUALITY_KEYWORDS = ["looking at viewer", "tsunako", "masterpiece", "best quality", "high score", "great score", "absurdres", "highres"]
const NEGATIVE_KEYWORDS = [
    "bad anatomy", "bad feet", "bad hands", "bad proportions", "bad perspective",
    "wrong hand", "wrong foot", "ugly hands", "ugly arms",
    "missing finger", "extra finger", "fewer digits", "extra digits",
    "extra toes", "missing toes", "extra arms", "extra faces", "multiple heads", "no pussy",

    "error", "artistic error", "wardrobe error",
    "text", "signature", "watermark", "username", "blurry", "cropped", "lowres",

    "worst quality", "low quality",
    "low score", "bad score", "average score",

    "censored", "blank censor",
    "afterimage", "motion blur", "speed lines", "motion lines",
    "futanari", "aged up", "old", "wrinkled skin",
    "1boy", "2boys", "3boys", "multiple boys"
]


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
