import TestUtil from './test_util.js';

TestUtil.jsonRequest('http://127.0.0.1:3000/render_content', {
    content: 'Hello, world!'
})