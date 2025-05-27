import { CharacterMemoryInterface, StyleMemoryInterface, ImageGenerateInterface, VoiceGenerateInterface, BackgroundMemoryInterface } from '../interfaces/index.js';
import { CharacterModel, StyleModel, BackgroundModel, ImageModel } from '../models/index.js';

class BackendInterface {
    static async addCharacters(rawCharacterModels) {
        const requestBody = {
            characters: rawCharacterModels.map(rawCharacterModel => rawCharacterModel.toJsonDict())
        }

        for(let character of requestBody.characters) {
            await CharacterModel.translateReqBody(character);
        }

        return CharacterMemoryInterface.addCharacters(requestBody.characters);
    }

    static async isCharactersExists(characterNames) {
        const requestBody = {
            characters: characterNames.map(characterName => ({
                name: characterName
            }))
        }

        const characters = await CharacterMemoryInterface.getCharacters(requestBody.characters);

        const existsCharacters = new Set();
        characters.forEach(character => {
            existsCharacters.add(character.name);
        });
        return existsCharacters;
    }


    static async addStyles(rawStyleModels) {
        const requestBody = {
            styles: rawStyleModels.map(rawStyleModel => rawStyleModel.toJsonDict())
        }

        for(let style of requestBody.styles) {
            await StyleModel.translateReqBody(style);
        }

        return StyleMemoryInterface.addStyles(requestBody.styles);
    }

    static async addBackgrounds(rawBackgroundModels) {
        const requestBody = {
            backgrounds: rawBackgroundModels.map(rawBackgroundModel => rawBackgroundModel.toJsonDict())
        }

        for(let background of requestBody.backgrounds) {
            await BackgroundModel.translateReqBody(background);
        }

        return BackgroundMemoryInterface.addBackgrounds(requestBody.backgrounds);
    }


    static async generateImages(imageModels, isWaitUntilImagesGenerated = false) {
        const requestBody = {
            imageModels: imageModels.map(
                imageModel => imageModel.toJsonDict()
            ),
            isWaitUntilImagesGenerated: isWaitUntilImagesGenerated
        }
        
        for(let imageModel of requestBody.imageModels) {
            await ImageModel.translateReqBody(imageModel);
        }

        let urls = await ImageGenerateInterface.generateImages(requestBody.imageModels);
        if(requestBody.isWaitUntilImagesGenerated) {
            urls = await ImageGenerateInterface.waitUntilImagesGenerated(requestBody.imageModels);
        }

        return urls
    }

    static async checkImageCompletions(imageModels) {
        const requestBody = {
            imageModels: imageModels.map(
                imageModel => imageModel.toJsonDict()
            )
        }

        const completions = ImageGenerateInterface.checkImageCompletions(requestBody.imageModels);
        return completions
    }


    static async generateVoices(rawVoiceModels, isWaitUntilVoicesGenerated = false) {
        const requestBody = {
            voiceModels: rawVoiceModels.map(
                rawVoiceModel => rawVoiceModel.toJsonDict()
            ),
            isWaitUntilVoicesGenerated: isWaitUntilVoicesGenerated
        }

        let urls = await VoiceGenerateInterface.generateVoices(requestBody.voiceModels);
        if(requestBody.isWaitUntilVoicesGenerated) {
            urls = await VoiceGenerateInterface.waitUntilVoicesGenerated(requestBody.voiceModels);
        }
        return urls
    }

    static async checkVoiceCompletions(rawVoiceModels) {
        const requestBody = {
            voiceModels: rawVoiceModels.map(
                rawVoiceModel => rawVoiceModel.toJsonDict()
            )
        }

        const completions = await VoiceGenerateInterface.checkVoiceCompletions(requestBody.voiceModels);
        return completions;
    }
}

export default BackendInterface;