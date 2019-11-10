chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({
        drawMode: "Lines", 
        brushNum: 1
    }, function(){ 
        if (chrome.runtime.lastError) {
            console.warn("Whoops.. " + chrome.runtime.lastError.message);
        }
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'skribbl.io', schemes: ['https']}
            })],
            
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});