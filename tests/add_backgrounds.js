import TestUtil from './test_util.js';

TestUtil.jsonRequest('http://127.0.0.1:3000/addBackgrounds', {
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