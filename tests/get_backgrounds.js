import TestUtil from './test_util.js';

TestUtil.jsonRequest('http://127.0.0.1:3000/getBackgrounds', {
    resource_name: 'test_resource',
    backgrounds: [
        {
            background_id: 'lbi_airport'
        }
    ]
})