chrome.webRequest.onCompleted.addListener(
  function (details) {
    // storage.local.set çağrısını güvenli şekilde yap
    try {
      chrome.storage.local.set({
        statusCode: details.statusCode,
        redirectedFrom: details.initiator || '',
        redirectedTo: details.url
      }, function () {
        if (chrome.runtime.lastError) {
          console.error("Storage error:", chrome.runtime.lastError.message);
        }
      });
    } catch (e) {
      console.error("Exception in storage:", e);
    }
  },
  { urls: ["<all_urls>"] }
);
