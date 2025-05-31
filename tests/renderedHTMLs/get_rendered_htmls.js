import TestUtil from '../test_util.js';

TestUtil.jsonRequest('http://127.0.0.1:3000/getRenderedHTMLs', {
    resource_name: 'test_resource',
    renderedHTMLs: [
        {
            sequence_id: '1'
        }
    ]
})