let storage = {
    getData: function(key){
        return new Promise ((resolve, reject) => {
            chrome.storage.sync.get(key, (data) => {
                if (chrome.runtime.lastError){
                    reject(chrome.runtime.lastError.message);
                }

                resolve(data[key]);
            });        
        });
    },

    setData: function(data){
        return new Promise ((resolve, reject) => {
            chrome.storage.sync.set(data, () => {
                if (chrome.runtime.lastError){
                    reject(chrome.runtime.lastError.message);
                }

                resolve();
            });        
        });        
    }
};