chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getStorage")
      sendResponse({status: localStorage["filterArray"]});
    else
      sendResponse({}); // snub them.
});