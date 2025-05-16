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
            name: 'Leira',
            style_id: '2',
            copy_style_id: '1',
            clothes: 'driving uniform',
            clothes_color: 'pink',
            etc: 'bell collar, driver cap'
        }
    ]
})
