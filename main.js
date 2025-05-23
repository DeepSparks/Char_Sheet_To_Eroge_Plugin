import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

import {
    CharacterMemoryInterface, StyleMemoryInterface, ImageGenerateInterface, VoiceGenerateInterface, TranslateInterface, 
    GlobalQueueUtil, ImageQueueUtil, VoiceQueueUtil, 
    Utils, Config 
} from './main_features/index.js';


if(!fs.existsSync(".env")) {
    Utils.logToFile("No .env file found. Please create one by using env_example folder files.", 'error');
    process.exit(1);
}

dotenv.config();


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
    
    if (!imageGenerationServerOk || !voiceGenerationServerOk) {
        Utils.logToFile('Required servers are not running. Program will be terminated.', 'error');
        process.exit(1);
    }
}


checkDependencyServers().then(() => {
    const app = express();

    app.use(express.json());

    
    app.post('/addToLog', (req, res) => {
        Utils.logToFile(req.body.log, req.body.type);
        res.json({ success: true });
    });


    app.post('/addCharacters', (req, res) => {
        try {

            const characters = CharacterMemoryInterface.addCharacters(req.body.characters);
            res.json({ characters });

        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });

    app.post('/getCharacters', (req, res) => {
        try {

            const characters = CharacterMemoryInterface.getCharacters(req.body.characters);
            res.json({ characters });

        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });


    app.post('/addStyles', (req, res) => {
        try {

            const styles = StyleMemoryInterface.addStyles(req.body.styles);
            res.json({ styles });

        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });

    app.post('/getStyles', (req, res) => {
        try {

            const styles = StyleMemoryInterface.getStyles(req.body.styles);
            res.json({ styles });

        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });


    app.post('/generateImages', async (req, res) => {
        try {

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

    app.post('/translateTexts', async (req, res) => {
        try {
            const results = await TranslateInterface.translateTexts(req.body.from, req.body.to, req.body.texts);
            res.json({ results });
        } catch (error) {
            Utils.logErrorToFile(error);
            res.json({ error: error.message, stack: error.stack });
        }
    });
    

    app.listen(3000, () => {
        Utils.logToFile('Server is running on port 3000', 'info');
    });


    Utils.make_dir_if_not_exists('./outputs');
    Utils.make_dir_if_not_exists('./outputs/images');
    Utils.make_dir_if_not_exists('./outputs/voices');
    Utils.make_dir_if_not_exists('./outputs/memories');


    app.use('/outputs/images', express.static('./outputs/images'));  
    app.use('/outputs/voices', express.static('./outputs/voices'));
    app.use('/outputs/memories', express.static('./outputs/memories'));


    if(Config.IS_USE_GLOBAL_QUEUE) {
        GlobalQueueUtil.processRequestQueue();
    } else {
        ImageQueueUtil.processRequestQueue();
        VoiceQueueUtil.processRequestQueue();
    }
});