// Default API URL
let apiUrl = '';

// Icon paths
const icons = {
  default: 'icons/icon_default.svg',
  green: 'icons/icon_green.svg',
  red: 'icons/icon_red.svg'
};

// Load stored API URL
chrome.storage.sync.get(['apiUrl'], (result) => {
  if (result.apiUrl) {
    apiUrl = result.apiUrl;
    checkStatus();
  }
});

// Check API status
async function checkStatus() {
  if (!apiUrl) return;

  try {
    const response = await fetch(apiUrl);
    const status = response.status;
    
    if (status === 200) {
      chrome.action.setIcon({path: icons.green});
    } else if (status === 500) {
      chrome.action.setIcon({path: icons.red});
    }
  } catch (error) {
    console.error('Status check failed:', error);
    chrome.action.setIcon({path: icons.default});
  }
}

// Setup periodic checks
chrome.alarms.create('statusCheck', {periodInMinutes: 1});
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'statusCheck') {
    checkStatus();
  }
});

// Handle API URL updates
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateApiUrl') {
    apiUrl = request.url;
    chrome.storage.sync.set({apiUrl: request.url});
    checkStatus();
    sendResponse({success: true});
  }
});