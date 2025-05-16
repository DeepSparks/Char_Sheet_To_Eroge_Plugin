import TestUtil from './test_util.js';

TestUtil.jsonRequest('http://127.0.0.1:3000/addCharacters', {
    characters: [
        {
            name: 'Leira',
            style_id: '1',
            gender: 'girl',
            age: 'very young',
            hair_style: 'twintails',
            hair_color: 'pink',
            eye_color: 'blue',
            breast_size: 'flat',
            skin_color: 'pale',
            clothes: 'micro-bikini',
            clothes_color: 'white',
            etc: 'bell collar'
        },
        {
            name: 'Sophie',
            style_id: '1',
            gender: 'girl',
            age: 'very young',
            hair_style: 'bob cut',
            hair_color: 'blonde',
            eye_color: 'green',
            breast_size: 'flat',
            skin_color: 'fair',
            clothes: 'halter bikini',
            clothes_color: 'blue',
            etc: 'ankle bracelet'
        }
    ]
})

TestUtil.jsonRequest('http://127.0.0.1:3000/generateImages', {
    isWaitUntilImagesGenerated: true,
    imageModels: [
        {
            common_prompt: 'airport terminal, tropical island, morning, luxury, 1boy, 3girls, loli',
            character_prompts: [
                {name: 'Leira', style_id: '1', prompt: 'excited, twintails bouncing, waving enthusiastically'},
                {name: 'Sophie', style_id: '1', prompt: 'curtseying, bright smile'}
            ]
        }
    ]
})