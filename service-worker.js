// This runs in the background of the browser in general. Handles event listeners

  
// Ease of access. Auto Reloads all tabs that arent chrome tabs when reloading the extension.
chrome.runtime.onInstalled.addListener(async (reason) => {
    console.log(reason);
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.url.startsWith("chrome")) {
        continue;
      }
      await chrome.tabs.reload(tab.id);
    }
});