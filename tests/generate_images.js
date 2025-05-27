import TestUtil from './test_util.js';

async function main() {
    await TestUtil.jsonRequest('http://127.0.0.1:3000/addCharacters', {
        characters: [
            {
                name: 'Leira',
                gender: 'girl',
                age: 'very young',
                hair_style: 'twintails',
                hair_color: 'pink',
                eye_color: 'blue',
                breast_size: 'flat',
                skin_color: 'pale',
                etc: 'bell collar'
            }
        ]
    })
    
    await TestUtil.jsonRequest('http://127.0.0.1:3000/addStyles', {
        styles: [
            {
                style_id: 'Airport_Welcome',
                clothes: 'micro bikini',
                clothes_color: 'rainbow',
                bra: 'string',
                bra_color: 'transparent',
                panties: 'thong',
                panties_color: 'see-through',
                etc: 'barely covering, extremely revealing'
            }
        ]
    })
    
    await TestUtil.jsonRequest('http://127.0.0.1:3000/generateImages', {
        isWaitUntilImagesGenerated: true,
        imageModels: [
            {
                name: 'Leira',
                style_id: 'Airport_Welcome',
                common_prompt: "tropical airport, airplane in background, palm trees",
                common_negative_prompt: "",
                character_prompt: "running towards viewer, excited smile, childlike innocence, bouncing movements"
            }
        ]
    })

    await TestUtil.jsonRequest('http://127.0.0.1:3000/checkImageCompletions', {
        imageModels: [
            {
                name: 'Leira',
                style_id: 'Airport_Welcome',
                common_prompt: "tropical airport, airplane in background, palm trees",
                common_negative_prompt: "",
                character_prompt: "running towards viewer, excited smile, childlike innocence, bouncing movements"
            }
        ]
    })
}

main();
