document.addEventListener('DOMContentLoaded', () => {
  const apiUrlInput = document.getElementById('apiUrl');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // Load saved API URL
  chrome.storage.sync.get(['apiUrl'], (result) => {
    if (result.apiUrl) {
      apiUrlInput.value = result.apiUrl;
    }
  });

  // Handle save button click
  saveBtn.addEventListener('click', () => {
    const url = apiUrlInput.value.trim();
    
    if (!url) {
      showStatus('Please enter a valid API URL', 'error');
      return;
    }

    chrome.runtime.sendMessage(
      {action: 'updateApiUrl', url: url},
      (response) => {
        if (response && response.success) {
          showStatus('API URL saved successfully!', 'success');
        } else {
          showStatus('Failed to save API URL', 'error');
        }
      }
    );
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
});