import fs from 'fs';

class ResourceInterface {
    static getResourceNames() {
        const resourceNames = fs.readdirSync('./outputs');
        return resourceNames;
    }

    static removeResources(resourceNames) {
        resourceNames.forEach(resourceName => {
            const resourcePath = `./outputs/${resourceName}`;
            try {
                fs.rmSync(resourcePath, { recursive: true, force: true });
            } catch (error) {
                // 폴더가 존재하지 않는 경우 무시
                if (error.code !== 'ENOENT') {
                    console.warn(`리소스 삭제 중 오류 발생: ${resourcePath}`, error.message);
                }
            }
        });
    }
}

export default ResourceInterface;