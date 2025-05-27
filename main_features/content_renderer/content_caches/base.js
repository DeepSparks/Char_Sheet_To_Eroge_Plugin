// 공통 캐시 클래스
class ContentCacheBase {
    constructor() {
        this.cache = {};
    }

    has(promptString) {
        return !!this.cache[promptString];
    }

    get(promptString) {
        return this.cache[promptString];
    }

    set(promptString, url, seed) {
        this.cache[promptString] = { url, randomImageSeed: seed };
    }

    getAll() {
        return this.cache;
    }
}

export default ContentCacheBase;
