import fs from 'fs';

import { BackgroundModel } from '../models/index.js';
import Utils from '../utils.js';

const backgroundMemoryFilePath = 'outputs/memories/background_memory.json'

class BackgroundMemoryInterface {
    static backgroundMap = {};
    static isUpdating = false;


    static async addBackgrounds(backgrounds) {
        const processedBackgrounds = [];

        try{
            BackgroundMemoryInterface.isUpdating = true;
            BackgroundMemoryInterface.loadBackgroundMap();

            for(let background of backgrounds) {
                const backgroundModel = new BackgroundModel(background);
                BackgroundMemoryInterface.backgroundMap[BackgroundMemoryInterface.getBackgroundMapKey(backgroundModel)] = backgroundModel.toJsonDict();
                processedBackgrounds.push(BackgroundMemoryInterface.backgroundMap[BackgroundMemoryInterface.getBackgroundMapKey(backgroundModel)]);
            }

            BackgroundMemoryInterface.saveBackgroundMap();
            BackgroundMemoryInterface.isUpdating = false;
        } catch (error) {
            BackgroundMemoryInterface.isUpdating = false;
            throw error;
        }

        return processedBackgrounds;
    }

    static async addBackground(background) {
        try{
            BackgroundMemoryInterface.isUpdating = true;
            BackgroundMemoryInterface.loadBackgroundMap();

            const backgroundModel = new BackgroundModel(background);
            BackgroundMemoryInterface.backgroundMap[BackgroundMemoryInterface.getBackgroundMapKey(backgroundModel)] = backgroundModel.toJsonDict();

            BackgroundMemoryInterface.saveBackgroundMap();
            BackgroundMemoryInterface.isUpdating = false;
        } catch (error) {
            BackgroundMemoryInterface.isUpdating = false;
            throw error;
        }

        return BackgroundMemoryInterface.backgroundMap[BackgroundMemoryInterface.getBackgroundMapKey(backgroundModel)];
    }


    static getBackgrounds(backgrounds) {
        if(!BackgroundMemoryInterface.isUpdating) {
            BackgroundMemoryInterface.loadBackgroundMap();
        }

        return backgrounds.map(background => {
            if(!BackgroundMemoryInterface.backgroundMap[BackgroundMemoryInterface.getBackgroundMapKey(background)]) return null;
            return new BackgroundModel(BackgroundMemoryInterface.backgroundMap[BackgroundMemoryInterface.getBackgroundMapKey(background)]);
        }).filter(background => background !== null);
    }

    static getBackground(background) {
        if(!BackgroundMemoryInterface.isUpdating) {
            BackgroundMemoryInterface.loadBackgroundMap();
        }

        if(!BackgroundMemoryInterface.backgroundMap[BackgroundMemoryInterface.getBackgroundMapKey(background)]) return null;
        return new BackgroundModel(BackgroundMemoryInterface.backgroundMap[BackgroundMemoryInterface.getBackgroundMapKey(background)]);
    }


    static loadBackgroundMap() {
        let backgroundMap = {};
        if (fs.existsSync(backgroundMemoryFilePath)) {
            try {
                backgroundMap = JSON.parse(fs.readFileSync(backgroundMemoryFilePath, 'utf8'));
            } catch (error) {
                Utils.logToFile('Background memory file read error. New background memory file will be created. : ' + error, 'error');
            }
        }
        BackgroundMemoryInterface.backgroundMap = backgroundMap;
    }

    static saveBackgroundMap() {
        fs.writeFileSync(backgroundMemoryFilePath, JSON.stringify(BackgroundMemoryInterface.backgroundMap, null, 2));
    }

    static getBackgroundMapKey(background) {
        return background.background_id;
    }
}

export default BackgroundMemoryInterface;