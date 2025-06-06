import TagParserBase from './base.js';
import FrontConfig from '../front_config.js';
import { ImageModel } from '../models/index.js';
import BackendInterface from '../backend-interface.js';

class ImageTagParser extends TagParserBase {
    static async parseTagsFromContent(content, front_contents, back_contents, resource_name) {
        const OTHER_TAG_NAME = "Other";
        const CHECK_ATTRIBUTES = ImageModel.getCheckAttributes();
    
        const fullTagModelsMap = {};
        let fullTagInnerTexts= [];

        const TAG_REGEX = new RegExp(`<${FrontConfig.TAG_NAMES.SCENE}\\-([^\\s>]+)(?:\\s+([^>]*))?>(([^<]|<(?!\\/Scene\\-\\1>))*?)<\\/${FrontConfig.TAG_NAMES.SCENE}\\-[^\\s>]+>`, 'g')
        const matches = [...content.matchAll(TAG_REGEX)];

        let names_to_check = []
        for (const match of matches) {
            const name = match[1];
            const attributesStr = match[2];
            const attributes = this.targeted_parse_attributes(attributesStr, CHECK_ATTRIBUTES);
            
            if(name !== OTHER_TAG_NAME && !names_to_check.includes(name)) {
                names_to_check.push(name);
            }
            if(attributes.name && attributes.name !== OTHER_TAG_NAME && !names_to_check.includes(attributes.name)) {
                names_to_check.push(attributes.name);
            }
        }
        const existsCharacters = await BackendInterface.isCharactersExists(names_to_check, resource_name);


        for (const match of matches) {
            const fullTag = match[0];
            let name = match[1];
            const attributesStr = match[2];
            const innerText = match[3];
            const attributes = this.targeted_parse_attributes(attributesStr, CHECK_ATTRIBUTES);


            if(!attributes.name) {
                name = OTHER_TAG_NAME;
            }

            if(name !== OTHER_TAG_NAME && !existsCharacters.has(name)) {
                if(attributes.name && attributes.name !== OTHER_TAG_NAME && existsCharacters.has(attributes.name)) {
                    name = attributes.name;
                }
                else {
                    name = OTHER_TAG_NAME;
                }
            }

            if(name === OTHER_TAG_NAME) {
                fullTagInnerTexts.push({name: name, text: innerText, fullTag: fullTag});
                continue;
            }


            const model = new ImageModel(attributes);
            fullTagModelsMap[fullTag] = model;
            fullTagInnerTexts.push({name: name, text: innerText, fullTag: fullTag});
        }

        fullTagInnerTexts = [{
            name: OTHER_TAG_NAME,
            text: front_contents.join("\n"),
            fullTag: ""
        }, ...fullTagInnerTexts, {
            name: OTHER_TAG_NAME,
            text: back_contents.join("\n"),
            fullTag: ""
        }]
    
        
        if(fullTagInnerTexts.every(item => item.name === OTHER_TAG_NAME)) {
            const text = fullTagInnerTexts.map(item => item.text).join("\n");
            return {isSingleOtherTag: true, innerText: text};
        }


        const processedFullTagInnerTexts = {};
        
        const realNameIndices = [];
        fullTagInnerTexts.forEach((item, index) => {
            if (item.name !== OTHER_TAG_NAME) {
                realNameIndices.push(index);
            }
        });
    
        let usedOtherTagIndexes = new Set();
        realNameIndices.forEach((currentIndex, i) => {
            const current = fullTagInnerTexts[currentIndex];
            const textParts = [];
            const fullTagParts = [];
      
            // 앞쪽 Other 텍스트들 수집 (이전 실제 name 다음부터 현재까지)
            const startIndex = i === 0 ? 0 : realNameIndices[i - 1] + 1;
            for (let j = startIndex; j < currentIndex; j++) {
                if (fullTagInnerTexts[j].name === OTHER_TAG_NAME && !usedOtherTagIndexes.has(j)) {
                    textParts.push(fullTagInnerTexts[j].text);
                    fullTagParts.push(fullTagInnerTexts[j].fullTag);
                    usedOtherTagIndexes.add(j);
                }
            }
            
            // 현재 텍스트 추가
            textParts.push(current.text);
            fullTagParts.push(current.fullTag);
      
            // 뒤쪽 Other 텍스트들 수집 (현재 다음부터 다음 실제 name 전까지)
            const endIndex = i === realNameIndices.length - 1 ? fullTagInnerTexts.length : realNameIndices[i + 1];
            for (let j = currentIndex + 1; j < endIndex; j++) {
                if (fullTagInnerTexts[j].name === OTHER_TAG_NAME && !usedOtherTagIndexes.has(j)) {
                    textParts.push(fullTagInnerTexts[j].text);
                    fullTagParts.push(fullTagInnerTexts[j].fullTag);
                    usedOtherTagIndexes.add(j);
                }
            }
            
            processedFullTagInnerTexts[current.fullTag] = {
                name: current.name,
                text: textParts.join("\n"),
                fullTagParts: fullTagParts
            }
        });
    
    
        return { fullTagModelsMap, processedFullTagInnerTexts };
    }
}

export default ImageTagParser;