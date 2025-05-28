import BaseRenderer from './base.js';

class VoiceRenderer extends BaseRenderer {
    static createVoiceUrl(voicePath, seed) {
        return super.createUrl(voicePath, seed);
    }

    static createVoicePlayer(voiceUrl, is_end_of_content, is_preview_loadding_triggered) {
        if(is_end_of_content || (is_preview_loadding_triggered && voiceUrl.includes("randomSeed=1"))) {
            return `
            <span class="audio-container" style="height: 30px; overflow: hidden; position: relative; border-radius: 30px 30px 0px 30px; display: inline-block; opacity: 0.5; margin-top: 5px; margin-bottom: 2.5px;">
                <audio class="audio-player" controls style="position: relative; left: -10px; top: -40px;"><source src="${voiceUrl}" type="audio/wav"></audio>
            </span>
            `;
        }
        
        return `<span>
<span class="audio-generating-container"><span class="generating-content"><span class="wave-animation"><span class="wave-bar-1"></span><span class="wave-bar-2"></span><span class="wave-bar-3"></span><span class="wave-bar-4"></span></span><span>생성 중...</span></span></span>
</span>`;
    }
}

export default VoiceRenderer;