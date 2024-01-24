chrome.runtime.onMessage.addListener((data) => {
    const container = document.getElementById('dataContainer');
  
    data.phoneNumbers.forEach(number => {
      const div = document.createElement('div');
      div.textContent = number;
      const copyButton = document.createElement('button');
      copyButton.textContent = 'Copy';
      copyButton.onclick = () => {
        navigator.clipboard.writeText(number);
      };
      div.appendChild(copyButton);
      container.appendChild(div);
    });
  
    // Do the same for emails...
});

console.log("popup.js");