# Gemini Fast to Pro - Chrome Extension

A simple Chrome extension that automatically replaces all instances of "Gemini Fast" with "Gemini Pro" across the web.

## Features

- ✨ Automatically replaces "Gemini Fast" → "Gemini Pro" on all websites
- 🔄 Works with dynamically loaded content
- 🚀 Runs on page load and monitors for changes
- 📱 Case-insensitive replacement (handles "GEMINI FAST", "gemini fast", etc.)

## Installation

### For Development/Testing:

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select this folder (`no-more-gemini-fast`)
5. The extension will now be active!

### To Package for Distribution:

1. In `chrome://extensions/`, find this extension
2. Click the menu (⋮) and select "Pack extension"
3. This creates a `.crx` file for distribution

## How It Works

- The extension uses a **content script** that:
  - Walks through all text nodes on the page
  - Replaces "Gemini Fast" with "Gemini Pro"
  - Monitors for new content and applies replacement to dynamically added elements
  - Skips script and style tags to avoid breaking functionality

## Files

- **manifest.json** - Extension configuration
- **src/content.js** - Main script that does the replacement
- **icons/** - Extension icons (optional)

## Customization

To modify what gets replaced, edit `src/content.js`:

```javascript
// Change this line:
node.textContent = node.textContent.replace(/Gemini\s+Fast/gi, 'Gemini Pro');

// To replace different text. For example:
// node.textContent = node.textContent.replace(/Fast/gi, 'Pro');
```

## Troubleshooting

**The extension isn't replacing text:**
- Check that the extension is enabled in `chrome://extensions/`
- Try reloading the page
- Some websites have security restrictions that prevent content scripts from running

**I want to disable it temporarily:**
- Go to `chrome://extensions/` and toggle the extension off
- Reload the page

## License

Free to use and modify!
