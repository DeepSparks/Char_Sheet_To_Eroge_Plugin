class TestUtil {
    static async jsonRequest(url, body) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));

        return data;
    }
}

export default TestUtil;
