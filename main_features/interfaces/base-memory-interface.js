import fs from 'fs';
import Utils from '../utils.js';

class BaseMemoryInterface {
    // 자식 클래스에서 반드시 구현해야 하는 추상 메서드들
    static getMapKey(item) {
        throw new Error('getMapKey method must be implemented by subclass');
    }

    static getModelClass() {
        throw new Error('getModelClass method must be implemented by subclass');
    }

    static getMemoryFileName() {
        throw new Error('getMemoryFileName method must be implemented by subclass');
    }

    // 공통 유틸리티 메서드들
    static getMemoryFilePath(resource_name) {
        if (!resource_name) resource_name = '_global';
        const memory_file_dir = `outputs/${resource_name}/memories`;
        const memory_file_path = `${memory_file_dir}/${this.getMemoryFileName()}`;
        
        Utils.make_dir_if_not_exists(memory_file_dir);
        return memory_file_path;
    }

    static loadMemoryMap(resource_name) {
        let memoryMap = {};
        const filePath = this.getMemoryFilePath(resource_name);
        
        if (fs.existsSync(filePath)) {
            try {
                memoryMap = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            } catch (error) {
                Utils.logToFile(`${this.getMemoryFileName()} memory file read error. New memory file will be created. : ${error}`, 'error');
            }
        }
        return memoryMap;
    }

    static saveMemoryMap(memoryMap, resource_name) {
        const filePath = this.getMemoryFilePath(resource_name);
        fs.writeFileSync(filePath, JSON.stringify(memoryMap, null, 2));
    }

    // 공통 CRUD 메서드들
    static addItems(items, resource_name) {
        const processedItems = [];
        const ModelClass = this.getModelClass();

        let memoryMap = this.loadMemoryMap(resource_name);
        
        for (let item of items) {
            const model = new ModelClass(item);
            const key = this.getMapKey(item);
            memoryMap[key] = model.toJsonDict();
            processedItems.push(memoryMap[key]);
        }
        
        this.saveMemoryMap(memoryMap, resource_name);
        return processedItems;
    }

    static addItem(item, resource_name) {
        const ModelClass = this.getModelClass();
        let memoryMap = this.loadMemoryMap(resource_name);

        const model = new ModelClass(item);
        const key = this.getMapKey(item);
        memoryMap[key] = model.toJsonDict();

        this.saveMemoryMap(memoryMap, resource_name);
        return memoryMap[key];
    }

    static getItems(items, resource_name) {
        const ModelClass = this.getModelClass();
        let memoryMap = this.loadMemoryMap(resource_name);

        return items.map(item => {
            const key = this.getMapKey(item);
            if (!memoryMap[key]) return null;
            return new ModelClass(memoryMap[key]);
        }).filter(item => item !== null);
    }

    static getItem(item, resource_name) {
        const ModelClass = this.getModelClass();
        let memoryMap = this.loadMemoryMap(resource_name);

        const key = this.getMapKey(item);
        if (!memoryMap[key]) return null;
        return new ModelClass(memoryMap[key]);
    }
}

export default BaseMemoryInterface;