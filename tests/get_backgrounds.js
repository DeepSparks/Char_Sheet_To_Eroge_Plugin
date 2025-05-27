import TestUtil from './test_util.js';

TestUtil.jsonRequest('http://127.0.0.1:3000/getBackgrounds', {
    backgrounds: [
        {
            background_id: 'lbi_airport'
        }
    ]
})