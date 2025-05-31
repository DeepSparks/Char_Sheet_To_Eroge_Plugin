import TestUtil from './test_util.js';

TestUtil.jsonRequest('http://127.0.0.1:3000/addCharacters', {
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