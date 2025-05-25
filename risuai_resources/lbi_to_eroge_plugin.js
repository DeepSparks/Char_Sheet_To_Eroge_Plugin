//@name lbi_to_eroge_plugin
//@display-name LBI to Eroge Plugin v3.0.0

const CONFIG = {
    BACKEND_URL: "http://127.0.0.1:3000",
    IMAGE_WIDTH: 1248,
    IMAGE_HEIGHT: 832,
    TAG_NAMES: {
        STATUS: "Status",
        DEFINITIONS: "Definitions",
        CHARACTER: "Character",
        STYLE: "Style",
        SCENES: "Scenes",
        SCENE: "Scene",
        EVENT_OPTIONS: "Event-Options",
        VOICE: "Voice"
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
    START_OF_CONTENT_TAGS: ["<Definitions>", "<Scenes>"],
    END_OF_CONTENT_TAG: "</Scenes>",
    IS_USE_RANDOM_EVENT_SELECTION: false,
    IS_ONLY_ALLOW_GIRL_CHARACTER: true
};

const IMAGE_CONTAINER_STYLES = `
<style>
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
</style>    
`;

const VOICE_CONTAINER_STYLES = `
<style>
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
</style>
`;


// 기본 모델 클래스 - 공통 메서드 포함
class BaseModel {
    constructor(attributes) {
        this.attributes = attributes || {};
    }

    toJsonDict() {
        return { ...this.attributes };
    }

    toPromptString() {
        return Object.values(this.toJsonDict()).filter(attr => attr).join(', ');
    }
}

class StatusModel extends BaseModel {
    constructor(attributes) {
        super(attributes);
    }
}

class EventOptionsModel extends BaseModel {
    constructor(attributes) {
        super(attributes);
    }
}

class CharacterModel extends BaseModel {
    constructor(attributes) {
        super(attributes);
        this.name = attributes.name || '';
        this.gender = attributes.gender || '';
        this.age = attributes.age || '';
        this.hair_style = attributes.hair_style || '';
        this.hair_color = attributes.hair_color || '';
        this.eye_color = attributes.eye_color || '';
        this.breast_size = attributes.breast_size || '';
        this.skin_color = attributes.skin_color || '';
        this.etc = attributes.etc || '';
    }

    toJsonDict() {
        return { ...this };
    }
}

class StyleModel extends BaseModel {
    constructor(attributes) {
        super(attributes);
        this.style_id = attributes.style_id || '';
        this.clothes = attributes.clothes || '';
        this.clothes_color = attributes.clothes_color || '';
        this.bra = attributes.bra || '';
        this.bra_color = attributes.bra_color || '';
        this.panties = attributes.panties || '';
        this.panties_color = attributes.panties_color || '';
        this.etc = attributes.etc || '';
    }

    toJsonDict() {
        return { ...this };
    }
}

class ImageModel extends BaseModel {
    constructor(attributes) {
        super(attributes);

        this.name = attributes.name || '';
        this.style_id = attributes.style_id || '';

        this.view = attributes.view || '';
        this.pose = attributes.pose || '';
        this.expression = attributes.expression || '';
        this.background = attributes.background || '';
        this.nsfw = attributes.nsfw || 'none';
        this.etc_char = attributes.etc_char || '';
        this.etc_other = attributes.etc_other || '';

        this.common_prompt = attributes.common_prompt || '';
        this.common_negative_prompt = attributes.common_negative_prompt || '';
        this.character_prompt = attributes.character_prompt || '';


        this.common_prompt = [attributes.background, attributes.etc_other].filter(attr => attr).join(', '); // attributes.view는 퀄리티 이슈로 제외

        let nsfw_prompt = attributes.nsfw || 'none';
        if(nsfw_prompt === 'none') {
            this.common_negative_prompt = 'nsfw';
            nsfw_prompt = '';
        }
        else if(CONFIG.NSFW_PROMPT_MAP[nsfw_prompt]) {
            this.common_prompt = "nsfw, explicit, open clothes, " + this.common_prompt;
            nsfw_prompt = CONFIG.NSFW_PROMPT_MAP[nsfw_prompt];
        }
        this.character_prompt = [nsfw_prompt, attributes.pose, attributes.expression, attributes.etc_char].filter(attr => attr).join(', ') || '';
    }

    toJsonDict() {
        return { ...this };
    }
}

class VoiceModel extends BaseModel {
    constructor(attributes) {
        super(attributes);
        this.name = attributes.name || '';
        this.text = attributes.text || '';
        this.happy = Number(attributes.happy) || 0;
        this.fun = Number(attributes.fun) || 0;
        this.angry = Number(attributes.angry) || 0;
        this.sad = Number(attributes.sad) || 0;
        this.crying = Number(attributes.crying) || 0;
        
        this.emotions = {
            happy: this.happy,
            fun: this.fun,
            angry: this.angry,
            sad: this.sad,
            crying: this.crying
        }
    }
    
    toJsonDict() {
        return { ...this };
    }
}


class PluginBackend {
    static async jsonPostRequest(url, jsonData) {
        try {
            const response = await nativeFetch(`${CONFIG.BACKEND_URL}/${url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jsonData)
            });
            return response.json();
        } catch (error) {
            console.error(`API Request Error (${url}):`, error);
            throw error;
        }
    }

    static async addToLog(log, type = 'info') {
        await this.jsonPostRequest("addToLog", { log, type });
    }

    static async addCharacters(characterModels) {
        return this.jsonPostRequest("addCharacters", {
            characters: characterModels.map(characterModel => characterModel.toJsonDict())
        });
    }

    static async isCharactersExists(characterNames) {
        const result = await this.jsonPostRequest("getCharacters", {
            characters: characterNames.map(characterName => ({
                name: characterName
            }))
        });

        const existsCharacters = new Set();
        result.characters.forEach(character => {
            existsCharacters.add(character.name);
        });

        return existsCharacters;
    }

    static async addStyles(styleModels) {
        return this.jsonPostRequest("addStyles", {
            styles: styleModels.map(styleModel => styleModel.toJsonDict())
        });
    }

    static async generateImages(imageModels, isWaitUntilImagesGenerated = false) {
        return (await this.jsonPostRequest("generateImages", {
            imageModels: imageModels.map(
                imageModel => imageModel.toJsonDict()
            ),
            isWaitUntilImagesGenerated: isWaitUntilImagesGenerated
        })).urls;
    }

    static async generateVoices(voiceModels, isWaitUntilVoicesGenerated = false) {
        return (await this.jsonPostRequest("generateVoices", {
            voiceModels: voiceModels.map(
                voiceModel => voiceModel.toJsonDict()
            ),
            isWaitUntilVoicesGenerated: isWaitUntilVoicesGenerated
        })).urls;
    }
}


// 공통 캐시 클래스
class ContentCache {
    constructor() {
        this.cache = {};
    }

    has(promptString) {
        return !!this.cache[promptString];
    }

    get(promptString) {
        return this.cache[promptString];
    }

    set(promptString, url, seed) {
        this.cache[promptString] = { url, randomImageSeed: seed };
    }

    getAll() {
        return this.cache;
    }
}

// 특정 캐시 클래스들
class ImageCache extends ContentCache {}
class VoiceVoxCache extends ContentCache {}

const imageCache = new ImageCache();
const voiceVoxCache = new VoiceVoxCache();


// 공통 태그 파서 클래스
class TagParser {
    static parseTagsFromContent(content, tagName, ModelClass) {
        if (!content || !content.includes(`<${tagName}`)) {
            return {};
        }

        const fullTagModelsMap = {};
        const TAG_REGEX = new RegExp(`<${tagName}\\s+([^>]+)\\/>`, 'g');
        const matches = [...content.matchAll(TAG_REGEX)];

        for (const match of matches) {
            const fullTag = match[0];
            const attributesStr = match[1];
            const attributes = this.parse_attributes(attributesStr);
            
            const model = new ModelClass(attributes);
            fullTagModelsMap[fullTag] = model;
        }

        return fullTagModelsMap;
    }

    static parse_attributes(attributesStr) {
        const attributes = {};
        const attrRegex = /([^\s="']+)\s*=\s*["']([^"']*)["']/g;
        let attrMatch;
        
        while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
            const [, name, value] = attrMatch;
            attributes[name] = value;
        }

        return attributes;
    }
}

class StatusTagParser extends TagParser {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, CONFIG.TAG_NAMES.STATUS, StatusModel);
    }
}

class EventOptionsTagParser extends TagParser {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, CONFIG.TAG_NAMES.EVENT_OPTIONS, EventOptionsModel);
    }
}

class CharacterTagParser extends TagParser {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, CONFIG.TAG_NAMES.CHARACTER, CharacterModel);
    }
}

class StyleTagParser extends TagParser {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, CONFIG.TAG_NAMES.STYLE, StyleModel);
    }
}

class ImageTagParser extends TagParser {
    static async parseTagsFromContent(content, front_contents, back_contents) {
        const OTHER_TAG_NAME = "Othe";
    
        const fullTagModelsMap = {};
        let fullTagInnerTexts= [];

        const TAG_REGEX = new RegExp(`<${CONFIG.TAG_NAMES.SCENE}\-([^\\s>]+)(?:\\s+([^>]*))?>(([^<]|<(?!\\/Scene\\-\\1>))*?)<\\/${CONFIG.TAG_NAMES.SCENE}\\-\\1>`, 'g')
        const matches = [...content.matchAll(TAG_REGEX)];

        let names_to_check = []
        for (const match of matches) {
            const name = match[1];
            const attributesStr = match[2];
            const attributes = this.parse_attributes(attributesStr);
            
            if(name !== OTHER_TAG_NAME && !names_to_check.includes(name)) {
                names_to_check.push(name);
            }
            if(attributes.name && attributes.name !== OTHER_TAG_NAME && !names_to_check.includes(attributes.name)) {
                names_to_check.push(attributes.name);
            }
        }
        const existsCharacters = await PluginBackend.isCharactersExists(names_to_check);


        for (const match of matches) {
            const fullTag = match[0];
            let name = match[1];
            const attributesStr = match[2];
            const innerText = match[3];
            const attributes = this.parse_attributes(attributesStr);


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

class VoiceTagParser extends TagParser {
    static parseTagsFromContent(content) {
        const fullTagWithTextModelsMap = {};
        const TAG_REGEX = new RegExp(`"(.*)".*(<${CONFIG.TAG_NAMES.VOICE}\\s+([^>]+)\\/>)`, 'g')
        const matches = [...content.matchAll(TAG_REGEX)];

        for (const match of matches) {
            const fullTagWithText = match[0];
            const text = match[1];
            const attributesStr = match[2];
            const attributes = this.parse_attributes(attributesStr);
            
            const model = new VoiceModel({
                text: text,
                ...attributes
            });
            
            fullTagWithTextModelsMap[fullTagWithText] = model;
        }

        return fullTagWithTextModelsMap;
    }
}


// 공통 처리 클래스
class ContentProcessor {
    static async fetchOrGenerate(fullTagModelsMap, content, cacheInstance, generateFunction) {
        const models = Object.values(fullTagModelsMap);
        let urls = [];
        let randomSeed = CONFIG.NO_RANDOM_SEED;

        if (models.length === 0) {
            return { urls, randomSeed };
        }


        const firstPrompt = models[0].toPromptString();
        if (cacheInstance.has(firstPrompt)) {
            urls = models.map(model => {
                const prompt = model.toPromptString();
                return cacheInstance.has(prompt) ? cacheInstance.get(prompt).url : null;
            }).filter(url => url);
            
            randomSeed = cacheInstance.get(firstPrompt).randomImageSeed;
        } 
        else {
            const isUserSelection = content.includes(CONFIG.END_OF_CONTENT_TAG);
            urls = await generateFunction(models, isUserSelection);
            
            if (isUserSelection) {
                randomSeed = Math.floor(Math.random() * 100000000000).toString();
                
                models.forEach((model, index) => {
                    cacheInstance.set(model.toPromptString(), urls[index], randomSeed);
                });
            }
        }

        return { urls, randomSeed };
    }
}

class ImageProcessor extends ContentProcessor {
    static async fetchOrGenerateImages(imageTagModelMap, content) {
        return this.fetchOrGenerate(
            imageTagModelMap, 
            content, 
            imageCache, 
            PluginBackend.generateImages.bind(PluginBackend)
        );
    }
}

class VoiceTagProcessor extends ContentProcessor {
    static async fetchOrGenerateVoices(fullTagVoiceVoxModelsMap, content) {
        return this.fetchOrGenerate(
            fullTagVoiceVoxModelsMap, 
            content, 
            voiceVoxCache, 
            PluginBackend.generateVoices.bind(PluginBackend)
        );
    }
}


class ContentRenderer {
    static createUrl(contentPath, seed) {
        const UPDATE_COUNT = (seed === CONFIG.NO_RANDOM_SEED) ? Math.floor(displayCount/CONFIG.URL_UPDATE_FREQUENCY) : 0;
        return `${CONFIG.BACKEND_URL}/${contentPath}?randomSeed=${seed}&updateCount=${UPDATE_COUNT}`;
    }
}

class ImageRenderer extends ContentRenderer {
    static createImageUrl(imagePath, seed) {
        return super.createUrl(imagePath, seed);
    }

    static createSlideContext(imageUrl, content) {
        const randomSeed = Math.floor(Math.random() * 100000000000);

        const checkboxId = `hide-content-checkbox-${randomSeed}`;
        const containerId = `content-container-${randomSeed}`;
        
        return `
<style>
#${checkboxId}:checked ~ #${containerId} .content-container {
    visibility: hidden;
}
</style>

<input type="checkbox" id="${checkboxId}" class="hide-content-container-id"/>
<div class="root-container">
    <div style="width: ${CONFIG.IMAGE_WIDTH}px;">
        <label class="hide-content-container-label" for="${checkboxId}">내용 표시</label>
    </div>
</div>

<div class="root-container" id="${containerId}">
    <div class="image-container" style="background-image: url(${imageUrl});">
        <div class="content-container">
            ${content}
        </div>
    </div>
</div>`;
    }
}

class VoiceRenderer extends ContentRenderer {
    static createVoiceUrl(voicePath, seed) {
        return super.createUrl(voicePath, seed);
    }

    static createVoicePlayer(voiceVoxUrl) {
        return `
<span class="audio-container" style="height: 30px; overflow: hidden; position: relative; border-radius: 30px 30px 0px 30px; display: inline-block; opacity: 0.5;">
    <audio class="audio-player" controls style="position: relative; left: -10px; top: -40px;">
        <source src="${voiceVoxUrl}" type="audio/wav">
    </audio>
</span>
`;
    }
}


let displayCount = 0
async function handleDisplay(content) {
    const raw_content = content;
    try {

        if(!CONFIG.START_OF_CONTENT_TAGS.some(tag => content.includes(tag))) {
            return raw_content
        }


        displayCount += 1

        const status_parse_info = handleStatusTag(content);
        content = status_parse_info.content
        const content_for_status = status_parse_info.content_for_status

        const event_options_parse_info = handleEventOptionsTag(content);
        content = event_options_parse_info.content
        const content_for_event_options = event_options_parse_info.content_for_event_options

        const styles_for_content = getStylesForContent();


        content = await handleCharacterTag(content);
        content = await handleStyleTag(content);
        content = await handleVoiceTag(content);


        const image_tag_parse_info = await handleImageTag(content, [content_for_status], [content_for_event_options]);
        content = image_tag_parse_info.result
        const is_image_tag_processed = image_tag_parse_info.is_processed

        if(!is_image_tag_processed) {
            return `Content is processing... Please wait a moment. (${raw_content.length} characters generated) `
        }


        return content + styles_for_content;

    } catch (error) {
        PluginBackend.addToLog("[PLUGIN] Error while displaying content: " + error.message + '\n' + error.stack, "error");
        return raw_content;
    }
}

function handleStatusTag(content) {
    const statusTagModelMap = StatusTagParser.parseTagsFromContent(content);
    for(let tagIndex = 0; tagIndex < Object.keys(statusTagModelMap).length; tagIndex++) {
        const currentFullTag = Object.keys(statusTagModelMap)[tagIndex];
        content = content.replace(currentFullTag, "");
    }
    const statusModel = statusTagModelMap[Object.keys(statusTagModelMap)[0]];
    if(!statusModel) {
        return { content, content_for_status: "" };
    }

    const statusJsonDict = statusModel.toJsonDict();
    let content_for_status = ""
    for(let attribute of Object.keys(statusJsonDict)) {
        const attribute_name = attribute.charAt(0).toUpperCase() + attribute.slice(1);
        content_for_status += `${attribute_name}: ${statusJsonDict[attribute]}\n`;
    }
    return { content, content_for_status };
}

function handleEventOptionsTag(content) {
    const eventOptionsTagModelMap = EventOptionsTagParser.parseTagsFromContent(content);
    for(let tagIndex = 0; tagIndex < Object.keys(eventOptionsTagModelMap).length; tagIndex++) {
        const currentFullTag = Object.keys(eventOptionsTagModelMap)[tagIndex];
        content = content.replace(currentFullTag, "");
    }

    const eventOptionsModel = eventOptionsTagModelMap[Object.keys(eventOptionsTagModelMap)[0]];
    if(!eventOptionsModel) {
        return { content, content_for_event_options: "" };
    }

    const eventOptionsJsonDict = eventOptionsModel.toJsonDict();
    let content_for_event_options = ""
    if(eventOptionsJsonDict.first && eventOptionsJsonDict.second && eventOptionsJsonDict.third) {
        if(CONFIG.IS_USE_RANDOM_EVENT_SELECTION) {
            const event_options = [eventOptionsJsonDict.first, eventOptionsJsonDict.second, eventOptionsJsonDict.third];
            const randomEvent = Math.floor(Math.random() * 3);
            content_for_event_options = `## Random Event Selection\nNEXT EVENT: ${event_options[randomEvent]}`;
        } else {
            content_for_event_options = `${CONFIG.EVENT_OPTIONS_HEADER}\n1. ${eventOptionsJsonDict.first}\n2. ${eventOptionsJsonDict.second}\n3. ${eventOptionsJsonDict.third}`;
        }
    }
    return { content, content_for_event_options };
}

function getStylesForContent() {
    return IMAGE_CONTAINER_STYLES + VOICE_CONTAINER_STYLES
}

async function handleCharacterTag(content) {
    if (!content || !content.includes(`<${CONFIG.TAG_NAMES.CHARACTER}`)) {
        return content;
    }

    const characterTagModelMap = CharacterTagParser.parseTagsFromContent(content);
    for(let tagIndex = 0; tagIndex < Object.keys(characterTagModelMap).length; tagIndex++) {
        const currentFullTag = Object.keys(characterTagModelMap)[tagIndex];
        content = content.replace(currentFullTag, "");
    }

    if(CONFIG.IS_ONLY_ALLOW_GIRL_CHARACTER) {
        for(let characterKey of Object.keys(characterTagModelMap)) {
            const character = characterTagModelMap[characterKey];
            if(character.gender !== 'girl') {
                delete characterTagModelMap[characterKey];
            }
        }
    }

    await PluginBackend.addCharacters(Object.values(characterTagModelMap));

    return content;
}

async function handleStyleTag(content) {
    if (!content || !content.includes(`<${CONFIG.TAG_NAMES.STYLE}`)) {
        return content;
    }

    const styleTagModelMap = StyleTagParser.parseTagsFromContent(content);
    for(let tagIndex = 0; tagIndex < Object.keys(styleTagModelMap).length; tagIndex++) {
        const currentFullTag = Object.keys(styleTagModelMap)[tagIndex];
        content = content.replace(currentFullTag, "");
    }

    await PluginBackend.addStyles(Object.values(styleTagModelMap));

    return content;
}

async function handleImageTag(content, front_contents, back_contents) {
    if (!content || !content.includes(`<${CONFIG.TAG_NAMES.SCENE}`)) {
        return {
            result: content,
            is_processed: false
        };
    }

    const { fullTagModelsMap, processedFullTagInnerTexts } = await ImageTagParser.parseTagsFromContent(content, front_contents, back_contents);
    if(Object.keys(fullTagModelsMap).length === 0) {
        return {
            result: content,
            is_processed: false
        };
    }
    

    const { urls, randomSeed: randomImageSeed } = await ImageProcessor.fetchOrGenerateImages(
        fullTagModelsMap, content
    );


    let result = "";
    for(let tagIndex = 0; tagIndex < Object.keys(fullTagModelsMap).length; tagIndex++) {
        const currentFullTag = Object.keys(fullTagModelsMap)[tagIndex];
        const currentSlideContext = processedFullTagInnerTexts[currentFullTag].text;

        const currentUrl = ImageRenderer.createImageUrl(urls[tagIndex], randomImageSeed);
        const renderedSlide = ImageRenderer.createSlideContext(currentUrl, currentSlideContext);

        result += renderedSlide;
    }
    return {
        result,
        is_processed: Object.keys(fullTagModelsMap).length > 0
    }
}

async function handleVoiceTag(content) {
    if (!content || !content.includes(`<${CONFIG.TAG_NAMES.VOICE}`)) {
        return content;
    }

    const fullTagWithTextModelsMap = VoiceTagParser.parseTagsFromContent(content);
    if(Object.keys(fullTagWithTextModelsMap).length === 0) {
        return content;
    }

    const { urls: voiceUrls, randomSeed: voiceRandomSeed } = await VoiceTagProcessor.fetchOrGenerateVoices(
        fullTagWithTextModelsMap, content
    );

    let result = content;
    for(let tagIndex = 0; tagIndex < Object.keys(fullTagWithTextModelsMap).length; tagIndex++) {
        const currentFullTagWithText = Object.keys(fullTagWithTextModelsMap)[tagIndex];
        const currentVoiceUrl = VoiceRenderer.createVoiceUrl(voiceUrls[tagIndex], voiceRandomSeed);
        const renderedVoicePlayer = VoiceRenderer.createVoicePlayer(currentVoiceUrl);
        result = result.replace(currentFullTagWithText, currentFullTagWithText.replace(new RegExp(`<${CONFIG.TAG_NAMES.VOICE}\\s+([^>]+)\/>`, "g"), renderedVoicePlayer));
    }
    return result;
}


function initializePlugin() {
    addRisuScriptHandler("display", handleDisplay);
    PluginBackend.addToLog("Stable Diffusion Plugin loaded! Use StableDiffusion tag in messages to generate images.", "info");
}

function uninitializePlugin() {
    removeRisuScriptHandler("display", handleDisplay);
}

initializePlugin();
onUnload(uninitializePlugin);