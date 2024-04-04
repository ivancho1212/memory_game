
const storageModel = "userData";

class StorageGame {
    constructor(model) {
        this.modelStorage = model;
    }

    getStorage() {
        return localStorage.getItem(this.modelStorage);
    }

    setStorage(json) {
        return localStorage.setItem(this.modelStorage, json);
    }
}
