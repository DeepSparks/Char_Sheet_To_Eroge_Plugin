class GoogleTranslateProcessor {
    static async process(from, to, text) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=${from}&tl=${to}&q=${encodeURIComponent(text)}`;

        
        const f = await fetch(url, {
            method: "GET"
        });
        
        const res = await f.json();
    

        if (typeof(res) === 'string') {
            return res;
        }
    
        if ((!res[0]) || res[0].length === 0) {
            return text;
        }
    
        const result = res[0].map(s => s[0]).filter(Boolean).join('').replace(/\* ([^*]+)\*/g, '*$1*').replace(/\*([^*]+) \*/g, '*$1*');
        return result;
    }
}

export default GoogleTranslateProcessor;
