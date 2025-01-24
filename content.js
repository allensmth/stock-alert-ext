// Create status display element
const statusDisplay = document.createElement('div');
statusDisplay.id = 'website-status-display';
document.body.appendChild(statusDisplay);

// Listen for status updates from background
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'statusUpdate') {
    updateStatusDisplay(message.status);
  }
});

// Update status display
function updateStatusDisplay(status) {
  statusDisplay.textContent = `Status: ${status}`;
  statusDisplay.style.display = 'block';
  
  // Hide after 3 seconds
  setTimeout(() => {
    statusDisplay.style.display = 'none';
  }, 3000);
}

// Listen for Command key
let commandPressed = false;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Meta') {
    commandPressed = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'Meta') {
    commandPressed = false;
    statusDisplay.style.display = 'none';
  }
});