import TestUtil from '../test_util.js';

async function main() {
    await TestUtil.jsonRequest('http://127.0.0.1:3000/setConfig', {
        config: {
            is_use_image_generation: false,
            image_generation_mode: 'local-ai'
        }
    })
}

main();
