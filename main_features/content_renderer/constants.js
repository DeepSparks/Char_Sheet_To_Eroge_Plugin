export const CONFIG = {
    BACKEND_URL: "http://127.0.0.1:3000",
    IMAGE_WIDTH: 1248,
    IMAGE_HEIGHT: 832,
    TAG_NAMES: {
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
    },
    NO_RANDOM_SEED: "0",
    URL_UPDATE_FREQUENCY: 50,
    NSFW_PROMPT_MAP: {
        "none": "",
        "masturbation": "masturbation, female masturbation, pussy juice",
        "fellatio": "fellatio, invisible man, disembodied penis, cum in mouth",
        "sex": "sex, vaginal, invisible man, disembodied penis, cum in pussy",
        "anal": "anal, invisible man, disembodied penis, cum in pussy",
        "etc": ""
    },
    EVENT_OPTIONS_HEADER: "## Select Next Possible Event Options",
    IS_USE_RANDOM_EVENT_SELECTION: false,
    IS_ONLY_ALLOW_GIRL_CHARACTER: true,
    RESOURCES: {
        WAITING_IMAGE: `resources/image_waiting.png`
    }
};

export const IMAGE_CONTAINER_STYLES = `<style>
.root-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.image-container {
    width: ${CONFIG.IMAGE_WIDTH}px;
    height: ${CONFIG.IMAGE_HEIGHT}px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 20px;
    overflow: auto;
    border-radius: 5px;
}

.image-container-in-progress {
    width: ${CONFIG.IMAGE_WIDTH}px;
    min-height: ${CONFIG.IMAGE_HEIGHT}px;
    background-color: white;
    background-size: cover;
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
</style>`;

export const VOICE_CONTAINER_STYLES = `<style>
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