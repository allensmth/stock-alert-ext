// Default API URL
let apiUrl = '';

// Icon paths
const icons = {
  default: 'icons/icons24.png',
  green: 'icons/iconsgreen-24.png',
  red: 'icons/iconsred-24.png'
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
    console.log('Checking API status at:', apiUrl);
    const response = await fetch(apiUrl);
    const status = response.status;
    console.log('API response status:', status);
    
    if (status === 200) {
      console.log('Setting green icon');
      chrome.action.setIcon({path: icons.green});
    } else if (status === 500) {
      console.log('Setting red icon');
      chrome.action.setIcon({path: icons.red});
    } else {
      console.log('Unexpected status:', status);
      chrome.action.setIcon({path: icons.default});
    }
  } catch (error) {
    console.error('Status check failed:', error);
    chrome.action.setIcon({path: icons.default});
  }
}

// Setup periodic checks
chrome.alarms.create('statusCheck', {periodInMinutes: 1/6});
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