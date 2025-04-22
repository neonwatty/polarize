# Polarize – Enhance YouTube Coding Tutorials

**Polarize** is an open-source Chrome extension that helps developers learn faster from YouTube programming tutorials.

With a single-click, theme-adjustable overlay, Polarize brightens dark IDEs in videos, reduces glare, and uses AI to let you copy code straight from the screen.


<iframe width="560" height="315" src="https://www.youtube.com/embed/j1TMdbrnl_A" frameborder="0" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/j1TMdbrnl_A?modestbranding=1" frameborder="0" allowfullscreen></iframe>


Quick links:

- [Features](#-features) 
- [Getting Started (Local Development)](#-getting-started-local-development)
- [Local Testing](#-local-testing)
- [AI Code Copying (Gemini API Key Required)](#-ai-code-copying-gemini-api-key-required)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- 🎯 **AI-Powered Code Copying**  
  Capture and extract code directly from YouTube videos using Google Gemini.

- 🌈 **Theme-Adjustable Overlay**  
  Brighten dark IDEs and reduce glare with a resizable, customizable overlay.

- 🖱️ **One-Click Simplicity**  
  Enable or disable features with ease from the popup or context menu.

---

## 🚀 Getting Started (Local Development)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/polarize.git
cd polarize
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Extension

```bash
npm run build
``` 

### 4. Load the Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" in the top right corner.
3. Click "Load unpacked" and select the `dist` folder in your cloned repository.
4. The extension should now be loaded and ready to use!


## 🧪 Local Testing

Run interactive tests with:

```bash
npm run test:integration
```

## 🔐 AI Code Copying (Gemini API Key Required)

To use the code copying feature, you’ll need a [Google Gemini API key](https://ai.google.dev/gemini-api/docs/api-key).

Once you have it:

Open the extension popup

Paste your API key in the input field

Click "Save API Key"

Your key will be stored securely in local browser storage and used only for local requests.

## 🧩 Tech Stack

This is a simple Chrome extension built with the barebones:

- Chrome Extension (Manifest V3)

- Vite for bundling

- Vanilla JS

- Google Gemini for OCR/code recognition

- Playwright for integration tests


## 👐 Contributing

Pull requests are welcome! If you have feature suggestions, bug reports, or want to improve the UI, feel free to open an issue or PR.

## 📄 License

MIT — do whatever you'd like, just give credit where it's due.


