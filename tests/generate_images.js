import TestUtil from './test_util.js';

async function main() {
    await TestUtil.jsonRequest('http://127.0.0.1:3000/addCharacters', {
        resource_name: 'test_resource',
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
        resource_name: 'test_resource',
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

    await TestUtil.jsonRequest('http://127.0.0.1:3000/addBackgrounds', {
        resource_name: 'test_resource',
        backgrounds: [
            {
                background_id: 'lbi_airport',
                setting_type: 'indoor',
                location: 'luxury tropical airport',
                time_period: 'morning',
                season: 'summer',
                weather: 'sunny',
                special_features: 'floor-to-ceiling windows, tropical plants, marble floors',
                etc: 'air conditioning, soft tropical music playing'
            }
        ]
    })
    
    
    await TestUtil.jsonRequest('http://127.0.0.1:3000/generateImages', {
        isWaitUntilImagesGenerated: true,
        imageModels: [
            {
                resource_name: 'test_resource',
                name: 'Leira',
                style_id: 'Airport_Welcome',
                background_id: 'lbi_airport',
                common_prompt: "energetic standing posture, bright smile",
                common_negative_prompt: "",
                character_prompt: "running towards viewer, excited smile, childlike innocence, bouncing movements"
            }
        ]
    })

    await TestUtil.jsonRequest('http://127.0.0.1:3000/checkImageCompletions', {
        imageModels: [
            {
                resource_name: 'test_resource',
                name: 'Leira',
                style_id: 'Airport_Welcome',
                background_id: 'lbi_airport',
                common_prompt: "energetic standing posture, bright smile",
                common_negative_prompt: "",
                character_prompt: "running towards viewer, excited smile, childlike innocence, bouncing movements"
            }
        ]
    })
}

main();
