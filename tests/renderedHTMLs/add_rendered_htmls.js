import TestUtil from '../test_util.js';

TestUtil.jsonRequest('http://127.0.0.1:3000/addRenderedHTMLs', {
    resource_name: 'test_resource',
    renderedHTMLs: [
        {
            sequence_id: '1',
            renderedHTML: 'renderedHTML1'
        },
        {
            sequence_id: '2',
            renderedHTML: 'renderedHTML2'
        }
    ]
})