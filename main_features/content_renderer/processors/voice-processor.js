import ContentProcessorBase from './base.js';
import BackendInterface from '../backend-interface.js';

class VoiceProcessor extends ContentProcessorBase {
    static async fetchOrGenerateVoices(fullTagVoiceVoxModelsMap, is_end_of_content, voiceCache, resource_name) {
        return this.fetchOrGenerate(
            fullTagVoiceVoxModelsMap, 
            is_end_of_content, 
            voiceCache,
            resource_name,
            BackendInterface.generateVoices.bind(BackendInterface),
            BackendInterface.checkVoiceCompletions.bind(BackendInterface)
        );
    }
}

export default VoiceProcessor;