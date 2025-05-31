import TestUtil from '../test_util.js';

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
                voice_type: 'bright',
                etc: 'bell collar'
            }
        ]
    })
    
    await TestUtil.jsonRequest('http://127.0.0.1:3000/generateVoices', {
        isWaitUntilVoicesGenerated: true,
        voiceModels: [
            {
                resource_name: 'test_resource',
                name: 'Leira',
                text: '반갑습니다.',
                emotions: {
                    happy: 50,
                    fun: 30,
                    angry: 0,
                    sad: 0,
                    crying: 0
                }
            }
        ]
    })

    await TestUtil.jsonRequest('http://127.0.0.1:3000/checkVoiceCompletions', {
        voiceModels: [
            {
                resource_name: 'test_resource',
                name: 'Leira',
                text: '반갑습니다.',
                emotions: {
                    happy: 50,
                    fun: 30,
                    angry: 0,
                    sad: 0,
                    crying: 0
                }
            }
        ]
    })
}

main();
