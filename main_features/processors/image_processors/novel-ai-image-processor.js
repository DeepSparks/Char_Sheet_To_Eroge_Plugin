import jszip from 'jszip'
import fs from 'fs'

import Utils from '../../utils.js';
import Config from '../../config.js';

class NovelAIUIImageProcessor {
    static async process(imageModel) {
        const payload = NovelAIUIImageProcessor._makePayload(imageModel)

        const requestOptions = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Config.IMAGE_GENERATION_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          timeout: 300000
        };


        Utils.logToFile(`Generating image with payload: ${JSON.stringify(payload)}`, 'info');

        const response = await fetch(Config.IMAGE_GENERATION_SERVER_URL, requestOptions)

        if (!response.ok) {
            throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`)
        }

        Utils.logToFile(`Image generated: ${imageModel.toPromptString()}`, 'info');


        await NovelAIUIImageProcessor._saveImage(response, imageModel.toFilePath())
    }

    static async _saveImage(response, filePath) {
        const zipData = await response.arrayBuffer()
        
        const zip = new jszip()
        const contents = await zip.loadAsync(zipData)
        
        const file_item = Object.entries(contents.files)[0]
        const file = file_item[1]
        if(file.dir) {
            throw new Error("No images returned from Novel AI")
        }

        const data = await file.async('nodebuffer')
        fs.writeFileSync(filePath, data)
    }

    static _makePayload(imageModel) {
        const payload = {
            "input": "",
            "model": "nai-diffusion-4-full",
            "action": "generate",
            "parameters": {
                "params_version": 3,
                "width": 1216,
                "height": 832,
                "scale": 5.5,
                "sampler": "k_euler_ancestral",
                "steps": 28,
                "seed": 42,
                "n_samples": 1,
                "ucPreset": 2,
                "qualityToggle": false,
                "autoSmea": false,
                "dynamic_thresholding": false,
                "controlnet_strength": 1,
                "legacy": false,
                "add_original_image": true,
                "cfg_rescale": 0,
                "noise_schedule": "karras",
                "legacy_v3_extend": false,
                "skip_cfg_above_sigma": null,
                "use_coords": false,
                "legacy_uc": false,
                "normalize_reference_strength_multiple": true,
                "characterPrompts": [],
                "v4_prompt": {
                "caption": {
                    "base_caption": "",
                    "char_captions": []
                },
                "use_coords": false,
                "use_order": true
                },
                "v4_negative_prompt": {
                "caption": {
                    "base_caption": "",
                    "char_captions": []
                },
                "legacy_uc": false
                },
                "negative_prompt": "",
                "deliberate_euler_ancestral_bug": false,
                "prefer_brownian": true
            }
        }
        
        payload.input = imageModel.prompt
        payload.parameters.v4_prompt.caption.base_caption = imageModel.prompt

        payload.parameters.negative_prompt = imageModel.negative_prompt
        payload.parameters.v4_negative_prompt.caption.base_caption = imageModel.negative_prompt

        payload.parameters.characterPrompts = imageModel.character_prompts.map(prompt => ({
            prompt: prompt.prompt,
            uc: prompt.negative_prompt,
            center: {
              x: 0.5,
              y: 0.5
            },
            enabled: true
        }))
        payload.parameters.v4_prompt.caption.char_captions = imageModel.character_prompts.map(prompt => ({
          char_caption: prompt.prompt,
          centers: [{
            x: 0.5,
            y: 0.5
          }]
        }))
        payload.parameters.v4_negative_prompt.caption.char_captions = imageModel.character_prompts.map(prompt => ({
          char_caption: prompt.negative_prompt,
          centers: [{
            x: 0.5,
            y: 0.5
          }]
        }))

        payload.parameters.seed = Math.floor(Math.random() * 1000000000)

        return payload
    }
}

export default NovelAIUIImageProcessor;