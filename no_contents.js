chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "ON",
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.action.setBadgeText({
    text: "ON",
  });
});

const extensions = 'https://developer.chrome.com/docs/extensions'
const webstore = 'https://developer.chrome.com/docs/webstore'

chrome.tabs.onUpdated.addListener( async (tabid, ch_info, tab) => {

    // console.log("no query " + tab.url.includes("search_query"));
    const state = await chrome.action.getBadgeText({ tabId: tab.id });

    if (ch_info.status == 'complete' &&
        state == "ON" &&
        tab.url &&
        tab.url.includes("youtube") &&
        !tab.url.includes("search_query")) {
        await chrome.scripting.insertCSS({
            files: ["no_contents.css"],
            target: { tabId: tab.id },
        });
    }
});

chrome.action.onClicked.addListener(async (tab) => {
        // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        // Next state will always be the opposite
        const nextState = prevState === 'ON' ? 'OFF' : 'ON'

        // Set the action badge to the next state
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });
        if (nextState === "ON") {
            // Insert the CSS file when the user turns the extension on
            await chrome.scripting.insertCSS({
                files: ["no_contents.css"],
                target: { tabId: tab.id },
            });
        } else if (nextState === "OFF") {
            // Remove the CSS file when the user turns the extension off
            await chrome.scripting.removeCSS({
                files: ["no_contents.css"],
                target: { tabId: tab.id },
            });
        }
});
