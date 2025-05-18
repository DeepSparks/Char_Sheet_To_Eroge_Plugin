//@name lbi_to_eroge_plugin
//@display-name LBI to Eroge Plugin v1.1.1

const CONFIG = {
    BACKEND_URL: "http://127.0.0.1:3000",
    IMAGE_WIDTH: 1248,
    IMAGE_HEIGHT: 832,
    START_OF_CONTENT_TAG: "<Start/>",
    END_OF_CONTENT_TAG: "<End/>",
    NO_RANDOM_SEED: "0",
    URL_UPDATE_FREQUENCY: 50,
    NSFW_PROMPT_MAP: {
        "none": "",
        "masturbation": "masturbation, female masturbation, pussy juice",
        "fellatio": "fellatio, invisible man, disembodied penis, cum in mouth",
        "sex": "sex, vaginal, invisible man, disembodied penis, cum in pussy",
        "anal": "anal, invisible man, disembodied penis, cum in pussy",
        "etc": ""
    }
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

class CharacterModel extends BaseModel {
    constructor(attributes) {
        super(attributes);
        this.name = attributes.name || '';
        this.style_id = attributes.style_id || '';
        this.copy_style_id = attributes.copy_style_id || '';

        this.gender = attributes.gender || '';
        this.age = attributes.age || '';
        this.hair_style = attributes.hair_style || '';
        this.hair_color = attributes.hair_color || '';
        this.eye_color = attributes.eye_color || '';
        this.breast_size = attributes.breast_size || '';
        this.skin_color = attributes.skin_color || '';
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

        this.common_prompt = "";
        this.character_prompts = [];

        if(attributes.common)
            this._setUsingMultipleCharactersStyle(attributes);
        else
            this._setUsingSingleCharacterStyle(attributes);
    }

    _setUsingMultipleCharactersStyle(attributes) {
        this.common_prompt = attributes.common || '';

        this.character_prompts = [];
        for(let characterKey of Object.keys(attributes)) {
            if(characterKey === 'common')
                continue;

            const characterName = characterKey.split('-')[0];
            const styleId = characterKey.split('-')[1];

            this.character_prompts.push({
                name: characterName,
                style_id: styleId,
                prompt: attributes[characterKey] || ''
            });
        }
        this.character_prompts = this.character_prompts.slice(0, 3);
    }

    _setUsingSingleCharacterStyle(attributes) {
        this.common_prompt = [attributes.background, attributes.etc_other].filter(attr => attr).join(', '); // attributes.view는 퀄리티 이슈로 제외

        let nsfw_prompt = attributes.nsfw || 'none';
        if(nsfw_prompt === 'none') {
            this.common_negative_prompt = 'nsfw';
            nsfw_prompt = '';
        }
        else if(CONFIG.NSFW_PROMPT_MAP[nsfw_prompt])
            nsfw_prompt = CONFIG.NSFW_PROMPT_MAP[nsfw_prompt];

        this.character_prompts = [{
            name: attributes.name || '',
            style_id: attributes.style_id || '',
            prompt: [nsfw_prompt, attributes.pose, attributes.expression, attributes.etc_char].filter(attr => attr).join(', ') || ''
        }];
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
            
            const attributes = {};
            const attrRegex = /([^\s="']+)\s*=\s*["']([^"']*)["']/g;
            let attrMatch;
            
            while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
                const [, name, value] = attrMatch;
                attributes[name] = value;
            }
            
            const model = new ModelClass(attributes);
            fullTagModelsMap[fullTag] = model;
        }

        return fullTagModelsMap;
    }
}

class CharacterTagParser extends TagParser {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, "Character", CharacterModel);
    }
}

class ImageTagParser extends TagParser {
    static parseTagsFromContent(content) {
        return super.parseTagsFromContent(content, "StableDiffusion", ImageModel);
    }
}

class VoiceTagParser extends TagParser {
    static parseTagsFromContent(content) {
        if (!content || !content.includes(`<Voice`)) {
            return {};
        }

        const fullTagWithTextModelsMap = {};
        const TAG_REGEX = new RegExp(`"(.*)".*(\<Voice name="(.*)"\/>)`, 'g');
        const matches = [...content.matchAll(TAG_REGEX)];

        for (const match of matches) {
            const fullTagWithText = match[0];
            const text = match[1];
            const name = match[3];
            
            const attributes = {
                text: text,
                name: name
            };
            
            const model = new VoiceModel(attributes);
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
    try {

        displayCount += 1
        if(!content.includes(CONFIG.START_OF_CONTENT_TAG)) 
            return content;

        const isEndOfContent = content.includes(CONFIG.END_OF_CONTENT_TAG);


        content = sliceContent(content);
        
        content = await handleCharacterTag(content);
        content = await handleImageTag(content);
        content = await handleVoiceTag(content);

        content = addStyles(content);

        
        // if(isEndOfContent)
        //     PluginBackend.addToLog("[PLUGIN] Displayed content: " + content, "info");

        return content;

    } catch (error) {
        PluginBackend.addToLog("[PLUGIN] Error while displaying content: " + error.message + '\n' + error.stack, "error");
        return content;
    }
}

function sliceContent(content) {
    if(content.includes(CONFIG.START_OF_CONTENT_TAG) && !content.includes(CONFIG.END_OF_CONTENT_TAG)) {
        return content.slice(content.indexOf(CONFIG.START_OF_CONTENT_TAG), content.length);
    }
    if(content.includes(CONFIG.START_OF_CONTENT_TAG) && content.includes(CONFIG.END_OF_CONTENT_TAG)) {
        return content.slice(content.indexOf(CONFIG.START_OF_CONTENT_TAG), content.indexOf(CONFIG.END_OF_CONTENT_TAG) + CONFIG.END_OF_CONTENT_TAG.length);
    }
    return content;
}

function addStyles(content) {
    return IMAGE_CONTAINER_STYLES + VOICE_CONTAINER_STYLES + content;
}

async function handleCharacterTag(content) {
    if (!content || !content.includes("<Character")) {
        return content;
    }

    const characterTagModelMap = CharacterTagParser.parseTagsFromContent(content);
    for(let tagIndex = 0; tagIndex < Object.keys(characterTagModelMap).length; tagIndex++) {
        const currentFullTag = Object.keys(characterTagModelMap)[tagIndex];
        content = content.replace(currentFullTag, "");
    }

    await PluginBackend.addCharacters(Object.values(characterTagModelMap));

    return content;
}

async function handleImageTag(content) {
    if (!content || !content.includes("<StableDiffusion")) {
        return content;
    }

    const imageTagModelMap = ImageTagParser.parseTagsFromContent(content);
    if(Object.keys(imageTagModelMap).length === 0) {
        return content;
    }

    const { urls, randomSeed: randomImageSeed } = await ImageProcessor.fetchOrGenerateImages(
        imageTagModelMap, content
    );

    let result = content;
    for(let tagIndex = 0; tagIndex < Object.keys(imageTagModelMap).length; tagIndex++) {
        const currentFullTag = Object.keys(imageTagModelMap)[tagIndex];
        const nextFullTag = (tagIndex + 1 < Object.keys(imageTagModelMap).length) 
            ? Object.keys(imageTagModelMap)[tagIndex + 1] 
            : null;

        let currentSlideContext = content.slice(
            (tagIndex === 0) ? 0 : content.match(currentFullTag).index, 
            nextFullTag ? content.match(nextFullTag).index : content.length
        );

        const currentUrl = ImageRenderer.createImageUrl(urls[tagIndex], randomImageSeed);
        const slideContent = currentSlideContext.replace(currentFullTag, "");
        const renderedSlide = ImageRenderer.createSlideContext(currentUrl, slideContent);
        
        result = result.replace(currentSlideContext, renderedSlide); 
    }

    return result
}

async function handleVoiceTag(content) {
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
        result = result.replace(currentFullTagWithText, currentFullTagWithText.replace(/\<Voice name="(.*)"\/>/, renderedVoicePlayer));
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