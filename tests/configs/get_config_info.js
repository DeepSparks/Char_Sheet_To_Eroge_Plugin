import TestUtil from '../test_util.js';

async function main() {
    await TestUtil.jsonRequest('http://127.0.0.1:3000/getConfigInfo', {})
}

main();
