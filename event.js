chrome.runtime.onMessage.addEventListener((request, sender, sendResponse) => {
  if (request.doIt == "colorExtIcon") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.pageAction.show(tabs[0].id);
      console.log('Im in event js file ok')
    });
  }
});
