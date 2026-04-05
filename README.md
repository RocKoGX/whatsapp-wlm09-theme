# WhatsApp WLM 2009 Theme

A complete visual theme that transforms the frontend of WhatsApp Web into **Windows Live Messenger 2009**.

---

## Features

* **Windows Live Messenger 2009** styled interface
* Custom theme colors, wallpapers, and chat scenes
* Advertising-style banners
* Replacement of some WhatsApp icons
* Draggable Windows 7-style windows with functional maximize button
* Editable username in the header

---

## Customization (Wallpapers & Scenes)

You can add your own custom wallpapers and chat scenes:

### Chat Scenes

1. Go to the folder:

   ```
   assets/scenes/custom/
   ```

2. Add your images (recommended: `.png` or `.jpg`)

3. Register the image in:

   ```
   assets/scenes/scenes-index.json
   ```

---

### Wallpapers

1. Go to the folder:

   ```
   background/
   ```

2. Add your images

3. Register the image in:

   ```
   background/backgrounds-index.json
   ```

---

⚠️ **Important:**
If you don’t add the image name to the `.json` files, it will not appear in the extension.

---

## Installation

1. Clone or download this repository:

   ```bash
   git clone https://github.com/RocKoGX/whatsapp-wlm09-theme.git
   ```

2. Open Chrome / Brave and go to:

   ```
   chrome://extensions/
   ```

3. Enable **Developer mode**

4. Click **"Load unpacked"**

5. Select the project folder

6. Open WhatsApp Web

---

## Important Notes

* This extension modifies the WhatsApp Web DOM (React), so some features may break if WhatsApp updates its interface.
* This project is not affiliated with or endorsed by WhatsApp or Meta.

---

## Contributing

Contributions are welcome.
Feel free to open an issue or submit a pull request.
