import express from 'express';
import fs from 'fs';

import {
    CharacterMemoryInterface, StyleMemoryInterface, BackgroundMemoryInterface, ImageGenerateInterface, VoiceGenerateInterface, TranslateInterface, RenderContentInterface, ResourceInterface, RenderedHTMLMemoryInterface, ImageMemoryInterface, VoiceMemoryInterface,
    GlobalQueueUtil, ImageQueueUtil, VoiceQueueUtil, 
    CharacterModel, StyleModel, BackgroundModel, ImageModel,
    Utils, Config 
} from './main_features/index.js';


if(Config.IS_CLEAR_SERVER_AT_STARTUP) {
    const outputsDir = './outputs';
    if(fs.existsSync(outputsDir)) {
        fs.rmSync(outputsDir, { recursive: true, force: true });
    }

    const logsFilePath = Config.LOG_FILE_PATH;
    if(fs.existsSync(logsFilePath)) {
        fs.rmSync(logsFilePath);
    }
}


async function checkServerStatus(url, name) {
    if(!url) {
        Utils.logToFile(`${name} Server url is not set.`, 'info');
        return true;
    }

    if(url.includes('novelai')) {
        Utils.logToFile(`${name} Server is using NovelAI.`, 'info');
        return true;
    }


    try {
        await fetch(url, { timeout: 5000 });
        Utils.logToFile(`${name} Server is running.`, 'info');
        return true;
    } catch (error) {
        Utils.logToFile(`${name} Server(${url}) is not running.`, 'error');
        return false;
    }
}

async function checkDependencyServers() {
    let imageGenerationServerOk = true;
    let voiceGenerationServerOk = true;
    
    if(Config.IS_USE_IMAGE_GENERATION) {
        imageGenerationServerOk = await checkServerStatus(Config.IMAGE_GENERATION_SERVER_URL, 'Image Generation Server');
    }
    if(Config.IS_USE_VOICE_GENERATION) {
        voiceGenerationServerOk = await checkServerStatus(Config.VOICE_GENERATION_SERVER_URL, 'Voice Generation Server');
    }
    if(Config.IS_USE_VOICE_GENERATION && Config.VOICE_GENERATION_PROGRAM_PATH) {
        if(!fs.existsSync(Config.VOICE_GENERATION_PROGRAM_PATH)) {
            Utils.logToFile(`Voice Generation Program Path(${Config.VOICE_GENERATION_PROGRAM_PATH}) is not found.`, 'error');
            process.exit(1);
        }
        else {
            Utils.logToFile(`Voice Generation Program Path(${Config.VOICE_GENERATION_PROGRAM_PATH}) is found.`, 'info');
        }
    }
    
    if (!imageGenerationServerOk || !voiceGenerationServerOk) {
        Utils.logToFile('Required servers are not running. Program will be terminated.', 'error');
        process.exit(1);
    }
}


checkDependencyServers().then(() => {
    const app = express();

    app.use(express.json());

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    });

    
    app.post('/addToLog', (req, res) => {
        Utils.logToFile(req.body.log, req.body.type);
        res.json({ success: true });
    });


    app.post('/addCharacters', async (req, res) => {
        try {

            for(let character of req.body.characters) {
                await CharacterModel.translateReqBody(character);
            }

            const characters = CharacterMemoryInterface.addCharacters(req.body.characters, req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, characters});

        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });

    app.post('/getCharacters', (req, res) => {
        try {

            const characters = CharacterMemoryInterface.getCharacters(req.body.characters, req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, characters });

        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });

    app.post('/getAllCharacters', (req, res) => {
        try {
            const characters = CharacterMemoryInterface.getAllCharacters(req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, characters });
        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });


    app.post('/addStyles', async (req, res) => {
        try {
            
            for(let style of req.body.styles) {
                await StyleModel.translateReqBody(style);
            }

            const styles = await StyleMemoryInterface.addStyles(req.body.styles, req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, styles });

        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });

    app.post('/getStyles', (req, res) => {
        try {

            const styles = StyleMemoryInterface.getStyles(req.body.styles, req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, styles });

        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });

    app.post('/getAllStyles', (req, res) => {
        try {
            const styles = StyleMemoryInterface.getAllStyles(req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, styles });
        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });


    app.post('/addBackgrounds', async (req, res) => {
        try {

            for(let background of req.body.backgrounds) {
                await BackgroundModel.translateReqBody(background);
            }

            const backgrounds = await BackgroundMemoryInterface.addBackgrounds(req.body.backgrounds, req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, backgrounds });
            
        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });

    app.post('/getBackgrounds', (req, res) => {
        try {

            const backgrounds = BackgroundMemoryInterface.getBackgrounds(req.body.backgrounds, req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, backgrounds });

        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });

    app.post('/getAllBackgrounds', (req, res) => {
        try {
            const backgrounds = BackgroundMemoryInterface.getAllBackgrounds(req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, backgrounds });
        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });


    app.post('/addRenderedHTMLs', async (req, res) => {
        try {
            const renderedHTMLs = await RenderedHTMLMemoryInterface.addRenderedHTMLs(req.body.renderedHTMLs, req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, renderedHTMLs });
        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });

    app.post('/getRenderedHTMLs', (req, res) => {
        try {
            const renderedHTMLs = RenderedHTMLMemoryInterface.getRenderedHTMLs(req.body.renderedHTMLs, req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, renderedHTMLs });
        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });
    
    app.post('/getAllRenderedHTMLs', (req, res) => {
        try {
            const renderedHTMLs = RenderedHTMLMemoryInterface.getAllRenderedHTMLs(req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, renderedHTMLs });
        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });


    app.post('/generateImages', async (req, res) => {
        try {

            for(let imageModel of req.body.imageModels) {
                await ImageModel.translateReqBody(imageModel);
            }

            let urls = await ImageGenerateInterface.generateImages(req.body.imageModels);
            if(req.body.isWaitUntilImagesGenerated) {
                urls = await ImageGenerateInterface.waitUntilImagesGenerated(req.body.imageModels);
            }
            res.json({ urls });

        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });

    app.post('/checkImageCompletions', async (req, res) => {
        try {

            for(let imageModel of req.body.imageModels) {
                await ImageModel.translateReqBody(imageModel);
            }

            const completions = ImageGenerateInterface.checkImageCompletions(req.body.imageModels);
            res.json({ completions });

        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    })

    app.post('/addImages', async (req, res) => {
        try {
            const imageModels = await ImageMemoryInterface.addImages(req.body.imageModels, req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, imageModels });
        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    })

    app.post('/getAllImages', (req, res) => {
        try {
            const imageModels = ImageMemoryInterface.getAllImages(req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, imageModels });
        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    })
    
    
    app.post('/generateVoices', async (req, res) => {
        try {

            let urls = await VoiceGenerateInterface.generateVoices(req.body.voiceModels);
            if(req.body.isWaitUntilVoicesGenerated) {
                urls = await VoiceGenerateInterface.waitUntilVoicesGenerated(req.body.voiceModels);
            }
            res.json({ urls });

        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });

    app.post('/checkVoiceCompletions', async (req, res) => {
        try {

            const completions = await VoiceGenerateInterface.checkVoiceCompletions(req.body.voiceModels);
            res.json({ completions });

        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    })

    app.post('/addVoices', async (req, res) => {
        try {
            const voiceModels = await VoiceMemoryInterface.addVoices(req.body.voiceModels, req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, voiceModels });
        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    })

    app.post('/getAllVoices', (req, res) => {
        try {
            const voiceModels = VoiceMemoryInterface.getAllVoices(req.body.resource_name);
            res.json({ resource_name: req.body.resource_name, voiceModels });
        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    })
    

    app.post('/translateTexts', async (req, res) => {
        try {
            const results = await TranslateInterface.translateTexts(req.body.from, req.body.to, req.body.texts);
            res.json({ results });
        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });

    app.post(`/renderContent`, async (req, res) => {
        try {
            const result = await RenderContentInterface.renderContent(req.body.content);
            res.json({ result });
        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });
    

    app.post('/getConfigInfo', (req, res) => {
        res.json(Config.get_config_info());
    });

    app.post('/setConfig', (req, res) => {
        Config.set_config(req.body.config);
        res.json({ success: true });
    });

    
    app.post('/getResourceNames', (req, res) => {
        res.json({ resourceNames: ResourceInterface.getResourceNames() });
    });

    app.post('/removeResources', (req, res) => {
        ResourceInterface.removeResources(req.body.resourceNames);
        res.json({ success: true });
    });
    

    app.listen(Config.SERVER_PORT, () => {
        Utils.logToFile(`Server is running on port ${Config.SERVER_PORT}`, 'info');
    });


    Utils.make_dir_if_not_exists('./outputs/_global/memories');

    app.use('/outputs', express.static('./outputs'));  
    app.use('/resources', express.static('./resources'));


    if(Config.IS_USE_GLOBAL_QUEUE) {
        GlobalQueueUtil.processRequestQueue();
    } else {
        ImageQueueUtil.processRequestQueue();
        VoiceQueueUtil.processRequestQueue();
    }
});