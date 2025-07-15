const memoryCache = {};

const Cache = {
    get(key) {
        return memoryCache[key];
    },
    set(key, value) {
        memoryCache[key] = value;
    },
    clear(key) {
        if (key) {
            delete memoryCache[key];
        } else {
            Object.keys(memoryCache).forEach(k => delete memoryCache[k]);
        }
    }
};

export default Cache;
