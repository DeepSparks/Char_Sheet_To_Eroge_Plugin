import { CharacterMemoryInterface, StyleMemoryInterface, ImageGenerateInterface, VoiceGenerateInterface, BackgroundMemoryInterface, RenderedHTMLMemoryInterface } from '../interfaces/index.js';
import { CharacterModel, StyleModel, BackgroundModel, ImageModel } from '../models/index.js';

class BackendInterface {
    static async addCharacters(rawCharacterModels, resource_name) {
        const requestBody = {
            characters: rawCharacterModels.map(rawCharacterModel => rawCharacterModel.toJsonDict())
        }

        for(let character of requestBody.characters) {
            await CharacterModel.translateReqBody(character);
        }

        return CharacterMemoryInterface.addCharacters(requestBody.characters, resource_name);
    }

    static async isCharactersExists(characterNames, resource_name) {
        const requestBody = {
            characters: characterNames.map(characterName => ({
                name: characterName
            }))
        }

        const characters = await CharacterMemoryInterface.getCharacters(requestBody.characters, resource_name);

        const existsCharacters = new Set();
        characters.forEach(character => {
            existsCharacters.add(character.name);
        });
        return existsCharacters;
    }


    static async addStyles(rawStyleModels, resource_name) {
        const requestBody = {
            styles: rawStyleModels.map(rawStyleModel => rawStyleModel.toJsonDict())
        }

        for(let style of requestBody.styles) {
            await StyleModel.translateReqBody(style);
        }

        return StyleMemoryInterface.addStyles(requestBody.styles, resource_name);
    }

    static async addBackgrounds(rawBackgroundModels, resource_name) {
        const requestBody = {
            backgrounds: rawBackgroundModels.map(rawBackgroundModel => rawBackgroundModel.toJsonDict())
        }

        for(let background of requestBody.backgrounds) {
            await BackgroundModel.translateReqBody(background);
        }

        return BackgroundMemoryInterface.addBackgrounds(requestBody.backgrounds, resource_name);
    }


    static async generateImages(imageModels, isWaitUntilImagesGenerated = false, resource_name) {
        const requestBody = {
            imageModels: imageModels.map(
                imageModel => {
                    const imageModelDict = imageModel.toJsonDict();
                    imageModelDict.resource_name = resource_name;
                    return imageModelDict;
                }
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

    static async checkImageCompletions(imageModels, resource_name) {
        const requestBody = {
            imageModels: imageModels.map(
                imageModel => {
                    const imageModelDict = imageModel.toJsonDict();
                    imageModelDict.resource_name = resource_name;
                    return imageModelDict;
                }
            )
        }

        for(let imageModel of requestBody.imageModels) {
            await ImageModel.translateReqBody(imageModel);
        }

        const completions = ImageGenerateInterface.checkImageCompletions(requestBody.imageModels);
        return completions
    }


    static async generateVoices(rawVoiceModels, isWaitUntilVoicesGenerated = false, resource_name) {
        const requestBody = {
            voiceModels: rawVoiceModels.map(
                rawVoiceModel => {
                    const voiceModelDict = rawVoiceModel.toJsonDict();
                    voiceModelDict.resource_name = resource_name;
                    return voiceModelDict;
                }
            ),
            isWaitUntilVoicesGenerated: isWaitUntilVoicesGenerated
        }

        let urls = await VoiceGenerateInterface.generateVoices(requestBody.voiceModels);
        if(requestBody.isWaitUntilVoicesGenerated) {
            urls = await VoiceGenerateInterface.waitUntilVoicesGenerated(requestBody.voiceModels);
        }
        return urls
    }

    static async checkVoiceCompletions(rawVoiceModels, resource_name) {
        const requestBody = {
            voiceModels: rawVoiceModels.map(
                rawVoiceModel => {
                    const voiceModelDict = rawVoiceModel.toJsonDict();
                    voiceModelDict.resource_name = resource_name;
                    return voiceModelDict;
                }
            )
        }

        const completions = await VoiceGenerateInterface.checkVoiceCompletions(requestBody.voiceModels);
        return completions;
    }


    static async addRenderedHTMLs(rawRenderedHTMLModels, resource_name) {
        const requestBody = {
            renderedHTMLModels: rawRenderedHTMLModels.map(rawRenderedHTMLModel => rawRenderedHTMLModel.toJsonDict())
        }

        return RenderedHTMLMemoryInterface.addRenderedHTMLs(requestBody.renderedHTMLModels, resource_name);
    }
}

export default BackendInterface;