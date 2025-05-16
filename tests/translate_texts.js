import TestUtil from './test_util.js';

TestUtil.jsonRequest('http://127.0.0.1:3000/translateTexts', {
    from: 'auto',
    to: 'ja',
    texts: [
        '안녕하세요',
        '오늘 날씨가 좋네요'
    ]
})