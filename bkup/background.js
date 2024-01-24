/*chrome.action.onClicked.addListener((tab) => {
    console.log("background.js has executed 4");
    chrome.tabs.create({url: "https://www.youtube.com"});
    //chrome.scripting.executeScript({
    //  target: {tabId: tab.id, allFrames: true},
    //  files: ['content.js']
    //});
    console.log("background.js has executed 3");
  });
  
console.log("background.js has executed 2");
*/

/*function reddenPage() {
    document.body.style.backgroundColor = 'red';
}
  
chrome.action.onClicked.addListener((tab) => {
    if (!tab.url.includes('chrome://')) {
        chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: reddenPage
        });
    }
});
*/

/*chrome.action.onLoaded.addListener((tab) => {
    chrome.tabs.remove(tab);
    console.log('here');
});
*/

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content.js']
    });
});

console.log('here');


