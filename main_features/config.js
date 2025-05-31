import fs from 'fs';
import path from 'path';

class Config {
    static _config = null;
    static _defaultConfig = null;

    static _initConfig() {
        if (this._config) return;

        const configPath = './config.json';
        const defaultConfigPath = './resources/default_config.json';

        // config.json이 없으면 default_config.json을 복사
        if (!fs.existsSync(configPath)) {
            if (fs.existsSync(defaultConfigPath)) {
                const defaultConfigData = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'));
                // default_config.json의 구조에서 실제 config 값들만 추출
                const configValues = {};
                defaultConfigData.configs.forEach(group => {
                    group.configs.forEach(config => {
                        configValues[config.config_id] = config.value;
                    });
                });
                fs.writeFileSync(configPath, JSON.stringify(configValues, null, 2));
                this._config = configValues;
            } else {
                throw new Error('Default config file not found');
            }
        } else {
            this._config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        // default config도 로드
        if (fs.existsSync(defaultConfigPath)) {
            this._defaultConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'));
        }
    }


    static get IS_USE_IMAGE_GENERATION() {
        this._initConfig();
        return this._config.is_use_image_generation;
    }
    static get IMAGE_GENERATION_MODE() { 
        this._initConfig();
        return this._config.image_generation_mode;
    }
    static get IMAGE_GENERATION_SERVER_URL() { 
        this._initConfig();
        return this._config.image_generation_server_url;
    }
    static get IMAGE_GENERATION_API_KEY() { 
        this._initConfig();
        return this._config.image_generation_api_key;
    }

    static get IMAGE_WAITING_FILE_PATH() { 
        this._initConfig();
        return this._config.image_waiting_file_path;
    }
    static get ADD_DEFAULT_NSFW_KEYWORD() { 
        this._initConfig();
        return this._config.add_default_nsfw_keyword;
    }
    static get ADDITIONAL_COMMON_PROMPT() { 
        this._initConfig();
        return this._config.additional_common_prompt;
    }
    static get ADDITIONAL_COMMON_NEGATIVE_PROMPT() { 
        this._initConfig();
        return this._config.additional_common_negative_prompt;
    }
    static get ADDITIONAL_CHARACTER_PROMPT() { 
        this._initConfig();
        return this._config.additional_character_prompt;
    }

    static get IS_NOT_USE_RANDOM_DYNAMIC_VIEW() {
        this._initConfig();
        return this._config.is_not_use_random_dynamic_view;
    }
    static get RANDOM_VIEW_KEYWORDS() {
        this._initConfig();
        return this._config.random_view_keywords.split(',').map(keyword => keyword.trim());
    }

    static get IS_NOT_USE_NSFW_PROMPT_MAP() {
        this._initConfig();
        return this._config.is_not_use_nsfw_prompt_map;
    }
    static get NSFW_PROMPT_MAP() {
        this._initConfig();
        return JSON.parse(this._config.nsfw_prompt_map);
    }
    static get DEFAULT_NSFW_KEYWORDS() {
        this._initConfig();
        return this._config.default_nsfw_keywords.split(',').map(keyword => keyword.trim());
    }

    static get NOVELAI_MODEL() {
        this._initConfig();
        return this._config.novelai_model;
    }
    static get NOVELAI_QUALITY_KEYWORDS() {
        this._initConfig();
        return this._config.novelai_quality_keywords.split(',').map(keyword => keyword.trim());
    }
    static get NOVELAI_NEGATIVE_KEYWORDS() {
        this._initConfig();
        return this._config.novelai_negative_keywords.split(',').map(keyword => keyword.trim());
    }
    static get NOVELAI_NEGATIVE_KEYWORDS_FOR_CHARACTER() {
        this._initConfig();
        return this._config.novelai_negative_keywords_for_character.split(',').map(keyword => keyword.trim());
    }

    static get LOCAL_AI_QUALITY_KEYWORDS() {
        this._initConfig();
        return this._config.local_ai_quality_keywords.split(',').map(keyword => keyword.trim());
    }
    static get LOCAL_AI_NEGATIVE_KEYWORDS() {
        this._initConfig();
        return this._config.local_ai_negative_keywords.split(',').map(keyword => keyword.trim());
    }


    static get TRANSLATION_MODE() {
        this._initConfig();
        return this._config.translation_mode;
    }
    static get TRANSLATION_SERVER_URL() {
        this._initConfig();
        return this._config.translation_server_url;
    }
    static get TRANSLATION_API_KEY() {
        this._initConfig();
        return this._config.translation_api_key;
    }


    static get IS_USE_VOICE_GENERATION() {
        this._initConfig();
        return this._config.is_use_voice_generation;
    }
    static get VOICE_GENERATION_MODE() { 
        this._initConfig();
        return this._config.voice_generation_mode;
    }
    static get VOICE_GENERATION_SERVER_URL() { 
        this._initConfig();
        return this._config.voice_generation_server_url;
    }
    static get VOICE_GENERATION_PROGRAM_PATH() {
        this._initConfig();
        return this._config.voice_generation_program_path;
    }
    static get IS_TRANSLATE_VOICE_SCRIPT() {
        this._initConfig();
        return this._config.is_translate_voice_script;
    }
    static get TRANSLATE_VOICE_SCRIPT_FROM() {
        this._initConfig();
        return this._config.translate_voice_script_from;
    }
    static get TRANSLATE_VOICE_SCRIPT_TO() {
        this._initConfig();
        return this._config.translate_voice_script_to;
    }

    static get VOICEVOX_SPEAKER_IDS() {
        this._initConfig();
        return this._config.voicevox_speaker_ids.split(',').map(id => id.trim()).map(Number);
    }

    static get VOICEPEAK_SPEAKER_IDS() {
        this._initConfig();
        return this._config.voicepeak_speaker_ids.split(',').map(id => id.trim());
    }
    static get VOICEPEAK_KEYWORD_JOIN() {
        this._initConfig();
        return JSON.parse(this._config.voicepeak_keyword_join);
    }
    static get IS_USE_VOICE_TYPE_MATCHING() {
        this._initConfig();
        return this._config.is_use_voice_type_matching;
    }
    static get VOICE_TYPE_MATCHING_INFO() {
        this._initConfig();
        return JSON.parse(this._config.voice_type_matching_info);
    }


    static get LOG_LOCALES() { 
        this._initConfig();
        return this._config.log_locales;
    }
    static get LOG_TIMEZONE() { 
        this._initConfig();
        return this._config.log_timezone;
    }
    static get LOG_FILE_PATH() { 
        this._initConfig();
        return this._config.log_file_path;
    }

    static get RETRY_INTERVAL_SECONDS() { 
        this._initConfig();
        return this._config.retry_interval_seconds;
    }
    static get NEXT_QUEUE_WAITING_SECONDS() { 
        this._initConfig();
        return this._config.next_queue_waiting_seconds;
    }
    static get IS_CLEAR_SERVER_AT_STARTUP() { 
        this._initConfig();
        return this._config.is_clear_server_at_startup;
    }
    static get IS_USE_GLOBAL_QUEUE() { 
        this._initConfig();
        return this._config.is_use_global_queue;
    }

    static get SERVER_HOST() {
        this._initConfig();
        return this._config.server_host;
    }
    static get SERVER_PORT() {
        this._initConfig();
        return this._config.server_port;
    }

    static get IS_USE_RANDOM_EVENT_SELECTION() {
        this._initConfig();
        return this._config.is_use_random_event_selection;
    }
    static get IS_ALLOW_MALE_CHARACTER() {
        this._initConfig();
        return this._config.is_allow_male_character;
    }
    static get IS_ALWAYS_EXPAND_SCENE() {
        this._initConfig();
        return this._config.is_always_expand_scene;
    }


    static set_config(updates) {
        this._initConfig();
        Object.assign(this._config, updates);
        fs.writeFileSync('./config.json', JSON.stringify(this._config, null, 2));
    }

    static get_config_info() {
        this._initConfig();
        
        if (!this._defaultConfig) {
            return this._config;
        }

        const configInfo = JSON.parse(JSON.stringify(this._defaultConfig));
        
        configInfo.configs.forEach(group => {
            group.configs.forEach(config => {
                if (this._config.hasOwnProperty(config.config_id)) {
                    config.value = this._config[config.config_id];
                }
            });
        });

        return configInfo;
    }
}

export default Config;