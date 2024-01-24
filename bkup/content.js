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
            justify-content: right;
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            right: 0;
            bottom: 0;
            min-width: 200px; /* Full width */
            min-height: 300px; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.8); /* Black w/ opacity */
            border: 1px solid black;
            border-radius: 10px;
        }

        .hidden {
            display: none;
        }

        .myDiv {
            position: sticky;
            top: 50vh;
            left: 20vw;
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

        .myTextNode {
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
    //body.insertBefore(myDiv, body.firstChild);
    myModal.appendChild(myDiv);

    let buttonScrape = document.createElement('button');
    buttonScrape.id = 'buttonScrape'; 
    buttonScrape.textContent = 'Scrape Now';
    myModal.appendChild(buttonScrape);
    buttonScrape.addEventListener('click', buttonHandlerScrape);

    let buttonClear = document.createElement('button');
    buttonClear.id = 'buttonClear'; 
    buttonClear.textContent = 'Clear Storage';
    myModal.appendChild(buttonClear);
    buttonClear.addEventListener('click', buttonHandlerClear);

    let buttonWriteToDisk = document.createElement('button');
    buttonWriteToDisk.id = 'buttonWriteToDisk'; 
    buttonWriteToDisk.textContent = 'Write To Disk';
    myModal.appendChild(buttonWriteToDisk);
    buttonWriteToDisk.addEventListener('click', buttonHandlerWrite);
}

function buttonHandlerClear() {
    localStorage.setItem('AmazonScraperData', "");
    localStorage.setItem('AmazonScraperCount', 0);
    addScraped();
}

function buttonHandlerWrite() {
    //
}

function buttonHandlerScrape() {
    var data = scrapeData();
    writeToLocalStorage(data);
    addScraped();
}


function countReviews() {
    // count the reviews and reflect the count in the modal
    // at least count the pages of reviews
}

function addScraped() {
    let count = localStorage.getItem('AmazonScraperCount');
    let div = document.getElementById('dataContainer');

    childNodes = div.childNodes;

    childNodes.forEach( (child) => {
        div.removeChild(child);
    });

    // Create a text node
    const textNode = document.createTextNode('Count: ' + count);

    // Append the text node to the <div> element
    div.appendChild(textNode);

}

function writeToLocalStorage(data) {
    // Step 1: Retrieve the existing value
    let existingData = localStorage.getItem('AmazonScraperData');
    let existingCount = localStorage.getItem('AmazonScraperCount');

    // Step 2: Modify the value (append in this case)
    if (existingData) {
        existingData += data;
        existingCount = parseInt(existingCount,10) + data.length;
    } else {
        existingData = data;
        existingCount = data.length;
    }

    // Step 3: Store the updated value
    localStorage.setItem('AmazonScraperData', existingData);
    localStorage.setItem('AmazonScraperCount', existingCount);
}

/*
var data = scrapeData();
writeToLocalStorage(data);
addScraped();
*/