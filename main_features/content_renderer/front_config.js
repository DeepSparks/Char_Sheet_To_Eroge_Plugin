import Config from '../config.js';

class FrontConfig {
    static get BACKEND_URL() {
        return `http://${Config.SERVER_HOST}:${Config.SERVER_PORT}`;
    }
    static get IMAGE_WIDTH() {
        return 1216;
    }
    static get IMAGE_HEIGHT() {
        return 832;
    }
    static get TAG_NAMES() {
        return {
            START: "Start",
            STATUS: "Status",
            DEFINITIONS: "Definitions",
            CHARACTER: "Character",
            STYLE: "Style",
            SCENES: "Scenes",
            BACKGROUND: "Background",
            SCENE: "Scene",
            VOICE: "Voice",
            EVENT_OPTIONS: "Event-Options",
            END: "End"
        };
    }
    static get NO_RANDOM_SEED() {
        return "0";
    }
    static get URL_UPDATE_FREQUENCY() {
        return 50;
    }
    static get EVENT_OPTIONS_HEADER() {
        return "## Select Next Possible Event Options";
    }
    static get RESOURCES() {
        return {
            WAITING_IMAGE: `resources/image_waiting.png`
        };
    }

    static get RANDOM_KEYWORDS() {
        return {
            VIEW: Config.RANDOM_VIEW_KEYWORDS
        };
    }
    static get MAP_KEYWORDS() {
        return {
            NSFW: Config.NSFW_PROMPT_MAP
        };
    }
    static get DEFAULT_KEYWORDS() {
        return {
            NSFW: Config.DEFAULT_NSFW_KEYWORDS
        };
    }

    static get IS_USE_RANDOM_EVENT_SELECTION() {
        return Config.IS_USE_RANDOM_EVENT_SELECTION;
    }
    static get IS_ALLOW_MALE_CHARACTER() {
        return Config.IS_ALLOW_MALE_CHARACTER;
    }
    static get IS_NOT_USE_RANDOM_DYNAMIC_VIEW() {
        return Config.IS_NOT_USE_RANDOM_DYNAMIC_VIEW;
    }
    static get IS_NOT_USE_NSFW_PROMPT_MAP() {
        return Config.IS_NOT_USE_NSFW_PROMPT_MAP;
    }

    static get PROGRESS_UI_STYLES() {
        return `<style>
.progress-container {
    background-color: #2c2c2c;
    color: #e0e0e0;
    padding: 20px;
    border-radius: 8px;
    font-family: sans-serif, "Apple SD Gothic Neo", "Malgun Gothic", "Dotum", sans-serif;
    border: 1px solid #444;
    margin: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}
.progress-text {
    font-size: 1.1em;
    margin-bottom: 15px;
    text-align: center;
}
#char-count {
    font-weight: bold;
    color: #5dade2;
}
.progress-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.progress-item {
    background-color: #383838;
    padding: 12px;
    border-radius: 6px;
    border-left: 4px solid #555;
}
.item-label {
    font-weight: bold;
    margin-right: 8px;
    color: #a9cce3;
}
.item-status {
    font-style: italic;
}
.status-pending {
    color: #f39c12; /* 주황색 */
    border-left-color: #f39c12;
}
.status-completed {
    color: #2ecc71; /* 녹색 */
    border-left-color: #2ecc71;
}
.status-none {
    color: #95a5a6; /* 회색 */
    border-left-color: #95a5a6;
}
.processed-items-list {
    list-style-type: none;
    padding-left: 10px;
    margin-top: 8px;
    font-size: 0.9em;
}
.processed-items-list li {
    margin-bottom: 4px;
    color: #bdc3c7;
    padding-left: 10px;
    position: relative;
}
.processed-items-list li::before {
    content: '✓';
    color: #2ecc71;
    position: absolute;
    left: -5px;
    font-weight: bold;
}
</style>`
    }
    static get IMAGE_CONTAINER_STYLES() {
        return `<style>
.root-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.image-container {
    width: ${FrontConfig.IMAGE_WIDTH}px;
    height: ${FrontConfig.IMAGE_HEIGHT}px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 20px;
    overflow: auto;
    border-radius: 5px;
}

.image-container-in-progress {
    width: ${FrontConfig.IMAGE_WIDTH}px;
    min-height: ${FrontConfig.IMAGE_HEIGHT}px;
    background-color: #383838;
    background-size: contain;
    background-position: center top;
    background-repeat: no-repeat;
    background-attachment: local;
    padding: 20px;
    overflow: visible;
    border-radius: 5px;
}

.hide-content-container-id {
    display: none;
}

.hide-content-container-label {
    opacity: 0;
    background-color: rgb(18, 126, 250);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
}

.hide-content-container-label:hover {
    opacity: 1;
}
</style>`
    }
    static get VOICE_CONTAINER_STYLES() {
        return `<style>
.audio-container {
    height: 30px;
    overflow: hidden;
    position: relative;
    border-radius: 30px 30px 0px 30px;
    display: inline-block;
    opacity: 0.5;
    margin-top: 5px;
    margin-bottom: 2.5px;
}

.audio-player {
    width: 200px;
    height: 40px;
    border-radius: 20px;
    background-color: rgb(255, 255, 255);
}

.audio-player::-webkit-media-controls-panel {
    background-color: : rgb(255, 255, 255);
}

.audio-player::-webkit-media-controls-play-button {
    background-color:: rgb(255, 255, 255);
    border-radius: 50%;
}

.audio-generating-container {
    height: 30px; 
    width: 120px;
    position: relative; 
    border-radius: 30px 30px 0px 30px; 
    display: inline-block; 
    opacity: 0.7;
    background: linear-gradient(90deg, #e0e0e0, #f0f0f0, #e0e0e0);
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
    border: 1px solid #ddd;
    margin-bottom: 10px;
}

.audio-generating-container .generating-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 11px;
    color: #666;
    font-family: Arial, sans-serif;
    font-weight: bolder;
    line-height: 1em;
    text-shadow: none;
}


.audio-generating-container .wave-animation {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-right: 5px;
}

.audio-generating-container .wave-bar-1 {
    width: 2px;
    height: 8px;
    background: #999;
    animation: wave 1s ease-in-out infinite;
    animation-delay: 0s;
}

.audio-generating-container .wave-bar-2 {
    width: 2px;
    height: 12px;
    background: #999;
    animation: wave 1s ease-in-out infinite;
    animation-delay: 0.1s;
}

.audio-generating-container .wave-bar-3 {
    width: 2px;
    height: 6px;
    background: #999;
    animation: wave 1s ease-in-out infinite;
    animation-delay: 0.2s;
}

.audio-generating-container .wave-bar-4 {
    width: 2px;
    height: 10px;
    background: #999;
    animation: wave 1s ease-in-out infinite;
    animation-delay: 0.3s;
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
@keyframes wave {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(0.3); }
}
</style>`;
    }
    static get ALL_STYLES() {
        return FrontConfig.PROGRESS_UI_STYLES + FrontConfig.IMAGE_CONTAINER_STYLES + FrontConfig.VOICE_CONTAINER_STYLES;
    }
}

export default FrontConfig;