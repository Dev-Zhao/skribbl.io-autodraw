let storage = {
    get: function (key) {
        return new Promise(function (resolve, reject) {
            chrome.storage.local.get(key, function (result) {
                if (result) {
                    resolve(result);
                }
                else {
                    reject();
                }
            });
        });
    },

    set: function (key, data) {
        return new Promise(function (resolve, reject) {
            chrome.storage.local.set({ key: data }, function () {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                else {
                    resolve();
                }
            });
        });
    }
}