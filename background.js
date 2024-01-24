const prompt = `I am going to paste in a bunch of product reviews. 
                The symbol "###" is the delimeter between each review. 
                I want you to give me the top 3 pros, the top 3 cons. 
                For each pro and con, give me the number of mentions for each in () at the beginning of the pro or con. 
                For each pro and con, ensure it has a bold title.
                At the end, give me the overall sentiment for the product in a professional yet engaging tone.`

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content.js']
    });
});

// Listen for messages from content.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    //handle download
    if (message.action === 'initiateDownload') {
        // Retrieve the data from chrome.storage.local
        chrome.storage.local.get(['AmazonScraperData'], function (result) {
          if (chrome.runtime.lastError) {
            console.error('Error retrieving data:', chrome.runtime.lastError);
          } else {
            const existingData = result.AmazonScraperData;
            if (existingData) {
              // Generate a unique filename (you can customize this)
              const filename = 'my_data.txt';
              
              // Use the chrome.downloads API to initiate the download
              chrome.downloads.download({
                url: 'data:text/plain;charset=utf-8,' + encodeURIComponent(existingData),
                filename: filename,
                saveAs: true, // Prompt the user to choose the download location
              });
            } else {
              console.error('No data found in chrome.storage.local.');
            }
          }
        });
      }
      
    // Handle clear
    if (message.action === 'clearStorage') {
        chrome.storage.local.set({ 'AmazonScraperData': '', 'AmazonScraperCount': 0 }, function () {
            // Send a message to content.js to trigger addScraped()
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'triggerAddScraped' });
                }
            });
        });
    }

    //handle get
    if (message.action === 'getAmazonScraperData') {
        chrome.storage.local.get(['AmazonScraperData', 'AmazonScraperCount'], function (result) {
            if (chrome.runtime.lastError) {
              console.error('Error retrieving data:', chrome.runtime.lastError);
            } else {
              const data = {
                AmazonScraperData: result.AmazonScraperData,
                AmazonScraperCount: result.AmazonScraperCount,
              };
              // Send the data back to the content script
              sendResponse({ data });
            }
          });
          // Indicate that you want to use sendResponse asynchronously
          return true;
        }
    
    // Handle set
    if (message.action === 'setAmazonScraperData') {
        const dataToSet = message.data;
    
        // Perform the storage operation using chrome.storage.local
        chrome.storage.local.get(['AmazonScraperData', 'AmazonScraperCount'], function (result) {
        if (chrome.runtime.lastError) {
            console.error('Error retrieving data:', chrome.runtime.lastError);
            return;
        }
    
        let existingData = result.AmazonScraperData || '';
        let existingCount = result.AmazonScraperCount || 0;

        if(existingData == '') {
            existingData += prompt;
        }
    
        // Modify the value (append in this case)
        existingData += dataToSet.join('###');
        existingData += '###';
        existingCount = parseInt(dataToSet.length, 10) + existingCount;
    
        // Store the updated value back to chrome.storage.local
        chrome.storage.local.set({ 'AmazonScraperData': existingData, 'AmazonScraperCount': existingCount }, function () {
            if (chrome.runtime.lastError) {
            console.error('Error setting data:', chrome.runtime.lastError);
            return;
            }
            // Send a response to content.js indicating the operation is complete
            sendResponse({ success: true });
        });
        });
        // Indicate that you want to use sendResponse asynchronously
        return true;
    }
  
});
  
  