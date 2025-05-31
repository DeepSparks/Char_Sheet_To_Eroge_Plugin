import { VoiceModel } from '../models/index.js';
import BaseMemoryInterface from './base-memory-interface.js';

class VoiceMemoryInterface extends BaseMemoryInterface {
    static getMapKey(voice) {
        return voice.saved_file_path;
    }

    static getModelClass() {
        return VoiceModel;
    }

    static getMemoryFileName() {
        return 'voice_memory.json';
    }

    
    static addVoices(voiceModels, resource_name) {
        return this.addItems(voiceModels, resource_name);
    }

    static addVoice(voiceModel, resource_name) {
        return this.addItem(voiceModel, resource_name);
    }

    static getVoices(voiceModels, resource_name) {
        return this.getItems(voiceModels, resource_name);
    }

    static getVoice(voiceModel, resource_name) {
        return this.getItem(voiceModel, resource_name);
    }

    static getAllVoices(resource_name) {
        return this.getAllItems(resource_name);
    }
}

export default VoiceMemoryInterface;