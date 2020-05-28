var storage = {
 
    /**
     * 存储
     * @param key 储存键
     * @param value 储存值
     */
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    /**
     * 取出数据
     * @param key 键
     */
    get(key) {
        return JSON.parse(localStorage.getItem(key));
    },
    /**
     * 删除数据
     * @param key 键
     * 
     */ 
     remove(key) {
        localStorage.removeItem(key);
    }
 
}

export default storage;