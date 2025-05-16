import fs from 'fs';

import Utils from '../../utils.js';
import Config from '../../config.js';

class StableDiffusionWebUIImageProcessor {
    static async process(imageModel) {
        const payload = {
            prompt: imageModel.prompt,
            negative_prompt: imageModel.negative_prompt,
            steps: 28,
            width: 1216,
            height: 832,
            cfg_scale: 5,
            sampler_name: "Euler a",
            scheduler: "Karras",
            batch_size: 1,
            override_settings: {
                CLIP_stop_at_last_layers: 2
            },
            override_settings_restore_afterwards: false
        };
        

        Utils.logToFile(`Generating image with payload: ${JSON.stringify(payload)}`, 'info');
        const response = await fetch(`${Config.IMAGE_GENERATION_SERVER_URL}/sdapi/v1/txt2img`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`Stable Diffusion API responded with status: ${response.status}`);
        }
        

        const data = await response.json();
        
        if (!data.images || data.images.length === 0) {
            throw new Error("No images returned from Stable Diffusion");
        }

        Utils.logToFile(`Image generated: ${imageModel.toPromptString()}`, 'info');

        
        const imageBuffer = Buffer.from(data.images[0], 'base64');
        fs.writeFileSync(imageModel.toFilePath(), imageBuffer);
    }
}

export default StableDiffusionWebUIImageProcessor;