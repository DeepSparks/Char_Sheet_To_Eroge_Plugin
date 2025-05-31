class ContentProcessorBase {
    static async fetchOrGenerate(fullTagModelsMap, is_end_of_content, cacheInstance, resource_name, generateFunction, checkCompletionFunction) {
        const models = Object.values(fullTagModelsMap);
        let urls = Array(models.length).fill(null);
        let randomSeeds = Array(models.length).fill(null);

        if (models.length === 0) {
            return { urls, randomSeeds };
        }


        for(let modelIndex = 0; modelIndex < models.length; modelIndex++) {
            const model = models[modelIndex];
            const cacheKey = model.toPromptString();

            if(cacheInstance.has(cacheKey)) {
                const matchedCacheInstance = cacheInstance.get(cacheKey);
                urls[modelIndex] = matchedCacheInstance.url;
                randomSeeds[modelIndex] = matchedCacheInstance.randomImageSeed;
            }
        }

        
        let models_to_generate = [];
        let generated_model_indexes = [];
        for(let modelIndex = 0; modelIndex < models.length; modelIndex++) {
            if(urls[modelIndex] !== null) continue;

            const model = models[modelIndex];
            models_to_generate.push(model);
            generated_model_indexes.push(modelIndex);
        } 

        const isCompleteds = await checkCompletionFunction(models_to_generate, resource_name);
        for(let completed_model_index = 0; completed_model_index < isCompleteds.length; completed_model_index++) {
            const model = models_to_generate[completed_model_index];
            const cacheKey = model.toPromptString();
            const modelIndex = generated_model_indexes[completed_model_index];

            if(cacheInstance.has(cacheKey)) {
                const matchedCacheInstance = cacheInstance.get(cacheKey);
                urls[modelIndex] = matchedCacheInstance.url;
                randomSeeds[modelIndex] = matchedCacheInstance.randomImageSeed;
                continue;
            }

            if(isCompleteds[completed_model_index].isCompleted) {
                urls[modelIndex] = isCompleteds[completed_model_index].filePath
                randomSeeds[modelIndex] = 1;
                cacheInstance.set(model.toPromptString(), urls[modelIndex], randomSeeds[modelIndex]);
            }
        } 


        const models_to_generate_second = [];
        let generated_model_indexes_second = [];
        for(let modelIndex = 0; modelIndex < models.length; modelIndex++) {
            if(urls[modelIndex] !== null) continue;

            const model = models[modelIndex];
            models_to_generate_second.push(model);
            generated_model_indexes_second.push(modelIndex);
        }

        const generated_urls = await generateFunction(models_to_generate_second, false, resource_name);
        for(let generated_url_index = 0; generated_url_index < generated_urls.length; generated_url_index++) {
            const model = models_to_generate_second[generated_url_index];
            const cacheKey = model.toPromptString();
            const modelIndex = generated_model_indexes_second[generated_url_index];

            if(cacheInstance.has(cacheKey)) {
                const matchedCacheInstance = cacheInstance.get(cacheKey);
                urls[modelIndex] = matchedCacheInstance.url;
                randomSeeds[modelIndex] = matchedCacheInstance.randomImageSeed;
                continue;
            }

            urls[modelIndex] = generated_urls[generated_url_index];
            if(is_end_of_content) {
                randomSeeds[modelIndex] = 1;
            }
            else {
                randomSeeds[modelIndex] = 0
            }
        }


        return { urls, randomSeeds };
    }
}

export default ContentProcessorBase;