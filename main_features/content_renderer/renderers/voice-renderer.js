import BaseRenderer from './base.js';

class VoiceRenderer extends BaseRenderer {
    static createVoiceUrl(voicePath, seed, is_end_of_content) {
        if(is_end_of_content) {
            return super.createUrl(voicePath, seed);
        }

        return ""
    }

    static createVoicePlayer(voiceVoxUrl, is_end_of_content) {
        if(is_end_of_content) {
            return `
            <span class="audio-container" style="height: 30px; overflow: hidden; position: relative; border-radius: 30px 30px 0px 30px; display: inline-block; opacity: 0.5; margin-top: 5px; margin-bottom: 2.5px;">
                <audio class="audio-player" controls style="position: relative; left: -10px; top: -40px;"><source src="${voiceVoxUrl}" type="audio/wav"></audio>
            </span>
            `;
        }
        
        return `<span>
<span class="audio-generating-container"><span class="generating-content"><span class="wave-animation"><span class="wave-bar-1"></span><span class="wave-bar-2"></span><span class="wave-bar-3"></span><span class="wave-bar-4"></span></span><span>생성 중...</span></span></span>
</span>`;
    }
}

export default VoiceRenderer;