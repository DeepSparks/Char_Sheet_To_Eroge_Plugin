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
        return Number(process.env.NEXT_QUEUE_WAITING_SECONDS) || 0.25;
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
}

export default Config;