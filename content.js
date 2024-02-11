// Function to scrape phone numbers and email addresses
function scrapeData() { 

    let results = [];

    let reviews = document.querySelectorAll('.review-text');
    if(reviews) {
        reviews.forEach(review => {
            let innerSpan = review.querySelector('span');
            if(innerSpan) {
                results.push(innerSpan.textContent);
            }
        })
    }

    return results;
}

if (typeof dataContainer === 'undefined') {
 
    let style = document.createElement('style');
    style.innerHTML = `
        .modal {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            left: 20vw;
            bottom: 15vh;
            min-width: 200px; /* Full width */
            min-height: 300px; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.8); /* Black w/ opacity */
            border: 1px solid black;
            border-radius: 10px;
            width: 25vw;
            flex-wrap: wrap;
        }

        .hidden {
            display: none;
        }

        .myDiv {
            position: sticky;
  
            background-color: #000000;
            margin: 15% auto; /* 15% from the top and centered */
            padding: 20px;
            border: 2px solid #FFFFFF;
            width: 80%; /* Could be more or less, depending on screen size */
            font-size: 20px;
            color: white;
            
        }

        .btn {
            border: 2px solid black;
            border-radius:5px;
            margin:10px;
            padding:10px;
            box-shadow: 10px 5px 5px black;
            flex: 1;
            min-width: calc(50% - 10px);
            flex-basis: 100%;
        }

        .btn:active {
            box-shadow: 5px 2px 2px black;
            transform: translate(2px, 2px);
        }

        .dispDiv {
            font-size: 10px;
            color:white;
            margin: 2px;
            white-space: pre;
        }
        `;
    document.head.appendChild(style);

    let body = document.querySelector('body');
    let myModal = document.createElement('div');
    myModal.classList.add('modal');
    body.appendChild(myModal);

    var myDiv = document.createElement('div');
    myDiv.id = 'dataContainer';
    myDiv.classList.add('myDiv');
    myModal.appendChild(myDiv);

    let buttonScrape = document.createElement('button');
    buttonScrape.id = 'buttonScrape'; 
    buttonScrape.textContent = 'Scrape Now';
    buttonScrape.classList.add('btn');
    myModal.appendChild(buttonScrape);
    buttonScrape.addEventListener('click', buttonHandlerScrape);

    let buttonClear = document.createElement('button');
    buttonClear.id = 'buttonClear'; 
    buttonClear.textContent = 'Clear Storage';
    buttonClear.classList.add('btn');
    myModal.appendChild(buttonClear);
    buttonClear.addEventListener('click', buttonHandlerClear);

    let buttonWriteToDisk = document.createElement('button');
    buttonWriteToDisk.id = 'buttonWriteToDisk'; 
    buttonWriteToDisk.textContent = 'Write To Disk';
    buttonWriteToDisk.classList.add('btn');
    myModal.appendChild(buttonWriteToDisk);
    buttonWriteToDisk.addEventListener('click', buttonHandlerWrite);

    /*let buttonCopyToClipboard = document.createElement('button');
    buttonCopyToClipboard.id = 'buttonWriteToClipboard'; 
    buttonCopyToClipboard.textContent = 'Copy to Clipboard';
    buttonCopyToClipboard.classList.add('btn');
    myModal.appendChild(buttonCopyToClipboard);
    buttonCopyToClipboard.addEventListener('click', buttonHandlerClipboard);
    */
    scrollToNext();
  
    // Select the target div
    const targetDiv = document.getElementById('cm_cr-review_list');
    
    // Create a MutationObserver instance
    const observer = new MutationObserver(handleChanges);
    
    // Configure the observer to watch for changes in attributes and child elements
    const config = { attributes: true, childList: true, subtree: true };
    
    // Start observing the target div
    observer.observe(targetDiv, config);
}

// Function to handle changes in the targetDiv
function handleChanges(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
        // Handle the changes here
        console.log('Target div has been modified:', mutation.target);
            scrollToNext();
        }
    }
    }

function buttonHandlerClear() {
    chrome.runtime.sendMessage({ action: 'clearStorage' });
}    

// Listen for messages from background.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // Handle message to trigger addScraped()
    if (message.action === 'triggerAddScraped') {
        addScraped();
    }
});

function buttonHandlerClipboard() {

}


function buttonHandlerWrite() {
    chrome.runtime.sendMessage({ action: 'initiateDownload' });
}

function buttonHandlerScrape() {
    var data = scrapeData();
    writeToStorage(data);
    // addScraped();
}


function countReviews() {
    // count the reviews and reflect the count in the modal
    // at least count the pages of reviews
}

function addScraped() {
    // Send a message to background.js to get the count
    chrome.runtime.sendMessage({ action: 'getAmazonScraperData' }, function (response) {
        if (chrome.runtime.lastError) {
            console.error('Error retrieving data:', chrome.runtime.lastError);
            return;
        }

        const data = response.data.AmazonScraperData;
        const count = response.data.AmazonScraperCount;

        let div = document.getElementById('dataContainer');

        // Remove existing child nodes
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }

        // Create a text node with the count
        const textNode = document.createTextNode('Count: ' + count);

        // Append the text node to the <div> element
        div.appendChild(textNode);
    });
}

function writeToStorage(data) {
    // Send a message to background.js to handle the storage operation
    chrome.runtime.sendMessage({ action: 'setAmazonScraperData', data: data }, function (response) {
        addScraped();
    });
  }

  function scrollToNext() {
    let targetDiv = document.getElementById('cm_cr-pagination_bar');
    window.scrollTo({
        top: targetDiv.offsetTop, // Get the top position of the target div
        behavior: 'smooth', // Use smooth scrolling
      });
  }
    
/*
var data = scrapeData();
writeToLocalStorage(data);
addScraped();
*/