import TestUtil from './test_util.js';

TestUtil.jsonRequest('http://127.0.0.1:3000/addBackgrounds', {
    backgrounds: [
        {
            background_id: 'lbi_airport',
            setting_type: 'indoor',
            location: 'luxury tropical airport',
            time_period: 'morning',
            weather: 'sunny',
            special_features: 'floor-to-ceiling windows, tropical plants, marble floors',
            etc: 'air conditioning, soft tropical music playing'
        }
    ]
})