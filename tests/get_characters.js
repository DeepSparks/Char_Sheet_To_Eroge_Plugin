import TestUtil from './test_util.js';

TestUtil.jsonRequest('http://127.0.0.1:3000/getCharacters', {
    characters: [
        {
            name: 'Leira',
            style_id: '1'
        },
        {
            name: 'Leira',
            style_id: '2'
        }
    ]
})