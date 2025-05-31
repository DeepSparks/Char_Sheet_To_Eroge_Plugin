class Config {
    static get IS_USE_IMAGE_GENERATION() {
        return process.env.IS_USE_IMAGE_GENERATION === 'true';
    }
    static get IMAGE_GENERATION_SERVER_URL() { 
        return process.env.IMAGE_GENERATION_SERVER_URL || '';
    }
    static get IMAGE_GENERATION_MODE() { 
        return process.env.IMAGE_GENERATION_MODE || 'stable-diffusion-web-ui';
    }
    static get IMAGE_KEYWORD_MODE() { 
        return process.env.IMAGE_KEYWORD_MODE || 'stable-diffusion-web-ui';
    }
    static get IMAGE_WAITING_FILE_PATH() { 
        return process.env.IMAGE_WAITING_FILE_PATH || './resources/image_waiting.png';
    }
    static get ADD_DEFAULT_NSFW_KEYWORD() { 
        return process.env.ADD_DEFAULT_NSFW_KEYWORD === 'true';
    }
    static get ADDITIONAL_COMMON_PROMPT() { 
        return process.env.ADDITIONAL_COMMON_PROMPT || '';
    }
    static get ADDITIONAL_COMMON_NEGATIVE_PROMPT() { 
        return process.env.ADDITIONAL_COMMON_NEGATIVE_PROMPT || '';
    }
    static get ADDITIONAL_CHARACTER_PROMPT() { 
        return process.env.ADDITIONAL_CHARACTER_PROMPT || '';
    }
    static get IMAGE_GENERATION_API_KEY() { 
        return process.env.IMAGE_GENERATION_API_KEY || '';
    }

    static get IS_USE_VOICE_GENERATION() {
        return process.env.IS_USE_VOICE_GENERATION === 'true';
    }
    static get VOICE_GENERATION_SERVER_URL() { 
        return process.env.VOICE_GENERATION_SERVER_URL || '';
    }
    static get VOICE_GENERATION_PROGRAM_PATH() {
        return process.env.VOICE_GENERATION_PROGRAM_PATH || '';
    }
    static get VOICE_GENERATION_MODE() { 
        return process.env.VOICE_GENERATION_MODE || 'voice-vox';
    }
    static get VOICE_KEYWORD_MODE() { 
        return process.env.VOICE_KEYWORD_MODE || 'voice-vox';
    }
    static get VOICE_GENERATION_API_KEY() { 
        return process.env.VOICE_GENERATION_API_KEY || '';
    }
    static get IS_TRANSLATE_VOICE_SCRIPT() {
        return process.env.IS_TRANSLATE_VOICE_SCRIPT === 'true';
    }
    static get TRANSLATE_VOICE_SCRIPT_FROM() {
        return process.env.TRANSLATE_VOICE_SCRIPT_FROM || 'auto';
    }
    static get TRANSLATE_VOICE_SCRIPT_TO() {
        return process.env.TRANSLATE_VOICE_SCRIPT_TO || 'ja';
    }

    static get TRANSLATION_MODE() {
        return process.env.TRANSLATION_MODE || 'google';
    }
    static get TRANSLATION_SERVER_URL() {
        return process.env.TRANSLATION_SERVER_URL || '';
    }
    static get TRANSLATION_API_KEY() {
        return process.env.TRANSLATION_API_KEY || '';
    }

    static get LOG_LOCALES() { 
        return process.env.LOG_LOCALES || 'ko-KR';
    }
    static get LOG_TIMEZONE() { 
        return process.env.LOG_TIMEZONE || 'Asia/Seoul';
    }
    static get LOG_FILE_PATH() { 
        return process.env.LOG_FILE_PATH || './logs.log';
    }

    static get RETRY_INTERVAL_SECONDS() { 
        return Number(process.env.RETRY_INTERVAL_SECONDS) || 3;
    }
    static get NEXT_QUEUE_WAITING_SECONDS() { 
        return Number(process.env.NEXT_QUEUE_WAITING_SECONDS) || 0;
    }
    static get IS_CLEAR_SERVER_AT_STARTUP() { 
        return process.env.IS_CLEAR_SERVER_AT_STARTUP === 'true';
    }
    static get IS_USE_GLOBAL_QUEUE() { 
        return process.env.IS_USE_GLOBAL_QUEUE === 'true';
    }

    static get VOICEVOX_SPEAKER_IDS() {
        if(!process.env.VOICEVOX_SPEAKER_IDS) return [];
        return process.env.VOICEVOX_SPEAKER_IDS.split(',').map(id => id.trim()).map(Number);
    }
    static get VOICEPEAK_SPEAKER_IDS() {
        if(!process.env.VOICEPEAK_SPEAKER_IDS) return [];
        return process.env.VOICEPEAK_SPEAKER_IDS.split(',').map(id => id.trim());
    }
    static get VOICEPEAK_KEYWORD_JOIN() {
        if(!process.env.VOICEPEAK_KEYWORD_JOIN) return {};
        return JSON.parse(process.env.VOICEPEAK_KEYWORD_JOIN);
    }
    static get IS_USE_VOICE_TYPE_MATCHING() {
        return process.env.IS_USE_VOICE_TYPE_MATCHING === 'true';
    }
    static get VOICE_TYPE_MATCHING_INFO() {
        if(!process.env.VOICE_TYPE_MATCHING_INFO) return {};
        return JSON.parse(process.env.VOICE_TYPE_MATCHING_INFO);
    }

    static get IS_NOT_USE_RANDOM_DYNAMIC_VIEW() {
        return process.env.IS_NOT_USE_RANDOM_DYNAMIC_VIEW === 'true';
    }
    static get RANDOM_VIEW_KEYWORDS() {
        if(!process.env.RANDOM_VIEW_KEYWORDS) return ["from behind", "from side", "from above", "from below", "top-down view", "three quarter view", "dutch angle", "low angle"];
        return process.env.RANDOM_VIEW_KEYWORDS.split(',').map(keyword => keyword.trim());
    }

    static get IS_NOT_USE_NSFW_PROMPT_MAP() {
        return process.env.IS_NOT_USE_NSFW_PROMPT_MAP === 'true';
    }
    static get NSFW_PROMPT_MAP() {
        if(!process.env.NSFW_PROMPT_MAP) return {"masturbation":"masturbation, female masturbation, pussy juice","fellatio":"fellatio, invisible man, disembodied penis","sex":"sex, vaginal, invisible man, disembodied penis","anal":"anal, invisible man, disembodied penis","etc":"invisible man"}
        return JSON.parse(process.env.NSFW_PROMPT_MAP);
    }
    static get DEFAULT_NSFW_KEYWORDS() {
        if(!process.env.DEFAULT_NSFW_KEYWORDS) return ["nsfw", "explicit", "open clothes", "uncensored"];
        return process.env.DEFAULT_NSFW_KEYWORDS.split(',').map(keyword => keyword.trim());
    }

    static get NOVELAI_MODEL() {
        return process.env.NOVELAI_MODEL || 'nai-diffusion-4-5-full';
    }
    static get NOVELAI_QUALITY_KEYWORDS() {
        if(!process.env.NOVELAI_QUALITY_KEYWORDS) return ["looking at viewer", "location", "detailed background", "tsunako", "masterpiece", "best quality", "amazing quality", "very aesthetic", "absurdres", "-1::censored ::", "commission", "official style", "best illustration", "photoshop (medium)"];
        return process.env.NOVELAI_QUALITY_KEYWORDS.split(',').map(keyword => keyword.trim());
    }
    static get NOVELAI_NEGATIVE_KEYWORDS() {
        if(!process.env.NOVELAI_NEGATIVE_KEYWORDS) return ["normal quality", "bad quality", "worst quality", "displeasing", "very displeasing", "lowres", "bad anatomy", "bad perspective", "bad proportions", "bad face", "bad arm", "bad hands", "bad leg", "bad feet", "bad reflection", "bad link", "bad source", "wrong hand", "wrong feet", "missing", "missing limb", "missing eye", "missing tooth", "missing ear", "missing finger", "extra", "extra faces", "extra eyes", "extra mouth", "extra ears", "extra breasts", "extra arms", "extra hands", "extra legs", "extra digits", "fewer digits", "cropped", "cropped head", "cropped torso", "cropped arms", "cropped legs", "JPEG artifacts", "signature", "watermark", "username", "blurry", "artist name", "fat", "duplicate", "mutation", "deformed", "disfigured", "long neck", "unfinished", "chromatic aberration", "scan", "scan artifacts", "abstract", "@_@", "brown skin", "glasses", "vertical lines", "vertical banding", "multiple views", "simple background", "aged up", "old"];
        return process.env.NOVELAI_NEGATIVE_KEYWORDS.split(',').map(keyword => keyword.trim());
    }
    static get NOVELAI_NEGATIVE_KEYWORDS_FOR_CHARACTER() {
        if(!process.env.NOVELAI_NEGATIVE_KEYWORDS_FOR_CHARACTER) return ["lowres", "aliasing"];
        return process.env.NOVELAI_NEGATIVE_KEYWORDS_FOR_CHARACTER.split(',').map(keyword => keyword.trim());
    }

    static get LOCAL_AI_QUALITY_KEYWORDS() {
        if(!process.env.LOCAL_AI_QUALITY_KEYWORDS) return ["looking at viewer", "tsunako", "masterpiece", "best quality", "high score", "great score", "absurdres", "highres"];
        return process.env.LOCAL_AI_QUALITY_KEYWORDS.split(',').map(keyword => keyword.trim());
    }
    static get LOCAL_AI_NEGATIVE_KEYWORDS() {
        if(!process.env.LOCAL_AI_NEGATIVE_KEYWORDS) return ["bad anatomy", "bad feet", "bad hands", "bad proportions", "bad perspective", "wrong hand", "wrong foot", "ugly hands", "ugly arms", "missing finger", "extra finger", "fewer digits", "extra digits", "extra toes", "missing toes", "extra arms", "extra faces", "multiple heads", "no pussy", "error", "artistic error", "wardrobe error", "text", "signature", "watermark", "username", "blurry", "cropped", "lowres", "worst quality", "low quality", "low score", "bad score", "average score", "censored", "blank censor", "afterimage", "motion blur", "speed lines", "motion lines", "futanari", "aged up", "old", "wrinkled skin", "1boy", "2boys", "3boys", "multiple boys"];
        return process.env.LOCAL_AI_NEGATIVE_KEYWORDS.split(',').map(keyword => keyword.trim());
    }

    static get SERVER_HOST() {
        return process.env.SERVER_HOST || '127.0.0.1';
    }
    static get SERVER_PORT() {
        return Number(process.env.SERVER_PORT) || 3000;
    }

    static get IS_USE_RANDOM_EVENT_SELECTION() {
        return process.env.IS_USE_RANDOM_EVENT_SELECTION === 'true';
    }
    static get IS_ALLOW_MALE_CHARACTER() {
        return process.env.IS_ALLOW_MALE_CHARACTER === 'true';
    }
    static get IS_ALWAYS_EXPAND_SCENE() {
        return process.env.IS_ALWAYS_EXPAND_SCENE === 'true';
    }
}

export default Config;