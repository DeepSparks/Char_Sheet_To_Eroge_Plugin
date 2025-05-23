import fs from 'fs';

import { StyleModel } from '../models/index.js';
import Utils from '../utils.js';

const styleMemoryFilePath = 'outputs/memories/style_memory.json'

class StyleMemoryInterface {
    static styleMap = {};
    static isUpdating = false;


    static addStyles(styles) {
        const processedStyles = [];

        try{
            StyleMemoryInterface.isUpdating = true;
            StyleMemoryInterface.loadStyleMap();
            styles.forEach(style => {
                StyleMemoryInterface.styleMap[StyleMemoryInterface.getStyleMapKey(style)] = new StyleModel(style).toJsonDict();
                processedStyles.push(StyleMemoryInterface.styleMap[StyleMemoryInterface.getStyleMapKey(style)]);
            });
            StyleMemoryInterface.saveStyleMap();
            StyleMemoryInterface.isUpdating = false;
        } catch (error) {
            StyleMemoryInterface.isUpdating = false;
            throw error;
        }

        return processedStyles;
    }

    static addStyle(style) {
        try{
            StyleMemoryInterface.isUpdating = true;
            StyleMemoryInterface.loadStyleMap();
            StyleMemoryInterface.styleMap[StyleMemoryInterface.getStyleMapKey(style)] = new StyleModel(style).toJsonDict();
            StyleMemoryInterface.saveStyleMap();
            StyleMemoryInterface.isUpdating = false;
        } catch (error) {
            StyleMemoryInterface.isUpdating = false;
            throw error;
        }

        return StyleMemoryInterface.styleMap[StyleMemoryInterface.getStyleMapKey(style)];
    }


    static getStyles(styles) {
        if(!StyleMemoryInterface.isUpdating) {
            StyleMemoryInterface.loadStyleMap();
        }

        return styles.map(style => {
            if(!StyleMemoryInterface.styleMap[StyleMemoryInterface.getStyleMapKey(style)]) return null;
            return new StyleModel(StyleMemoryInterface.styleMap[StyleMemoryInterface.getStyleMapKey(style)]);
        }).filter(style => style !== null);
    }

    static getStyle(style) {
        if(!StyleMemoryInterface.isUpdating) {
            StyleMemoryInterface.loadStyleMap();
        }

        if(!StyleMemoryInterface.styleMap[StyleMemoryInterface.getStyleMapKey(style)]) return null;
        return new StyleModel(StyleMemoryInterface.styleMap[StyleMemoryInterface.getStyleMapKey(style)]);
    }


    static loadStyleMap() {
        let styleMap = {};
        if (fs.existsSync(styleMemoryFilePath)) {
            try {
                styleMap = JSON.parse(fs.readFileSync(styleMemoryFilePath, 'utf8'));
            } catch (error) {
                Utils.logToFile('Style memory file read error. New style memory file will be created. : ' + error, 'error');
            }
        }
        StyleMemoryInterface.styleMap = styleMap;
    }

    static saveStyleMap() {
        fs.writeFileSync(styleMemoryFilePath, JSON.stringify(StyleMemoryInterface.styleMap, null, 2));
    }

    static getStyleMapKey(style) {
        return style.style_id;
    }
}

export default StyleMemoryInterface;