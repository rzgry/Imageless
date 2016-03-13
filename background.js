/*********************************************************************
 *        background.js for sending extension local data to          *
 *                  the applications content scripts                 *
 *********************************************************************/
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getStorage")
        sendResponse({
            status: localStorage["filterArray"]
        });
    else
        sendResponse({});
});
