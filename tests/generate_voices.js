const REQUEST_URL = 'http://127.0.0.1:3000/generateVoices';

const REQUEST_BODY = {
    isWaitUntilVoicesGenerated: true,
    voiceModels: [
        {
            name: 'char1',
            text: '반갑습니다.',
            emotions: {
                happy: 50,
                fun: 30,
                angry: 0,
                sad: 0,
                crying: 0
            }
        }
    ]
}

fetch(REQUEST_URL, {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(REQUEST_BODY)
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
