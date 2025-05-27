class RandomUtil {
    static get_random_array_index(array) {
        return Math.floor(Math.random() * array.length);
    }

    static get_random_integer(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static get_random_seed() {
        return Math.floor(Math.random() * 1000000000)
    }
}

export default RandomUtil;