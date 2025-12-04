# LiveKit Classroom Audio

This project lets you send audio from one teacher computer to many listeners on the same Wi‑Fi network. Latency stays very low so the class hears things almost instantly.

## What you need

- **Node.js 18 or newer** – lets Windows run the small helper server. Download from <https://nodejs.org>.
- **LiveKit Server 1.9.6 for Windows** – download the release zip/exe from <https://github.com/livekit/livekit/releases>.
- **An audio input** – this can be Virtual Audio Cable, a USB audio interface, or any input device that carries the teacher mix.
- **(Optional) Router hostname** – if your router can reserve a name such as `http://classroom:3000`, students won’t need to type an IP address.

## Setup

1. **Install JavaScript packages**
   ```powershell
   npm install
   ```
2. **Run the LiveKit server**
   - Open Command Prompt.
   - Go to the folder with `livekit-server.exe` and this project.
   - Start LiveKit and point it to the provided config:
     ```powershell
     livekit-server --config classroom.yaml
     ```
   - Leave that window open; it is the audio conference “engine.”
3. **Run the helper web server**
   - Open a second Command Prompt in the project folder.
   - Start the Node.js server, which hosts the web pages and generates secure access codes:
     ```powershell
     node server.js
     ```
   - Keep this window open while the class runs.
4. **Optional: give the server a friendly name**
   - On many routers you can add a “static lease” or DNS entry so that `http://classroom:3000` points to the teacher computer. This saves everyone from typing the raw IP address (for example `http://192.168.8.10:3000`).

## How to use it

- **Teacher computer**
   1. Visit `http://<server-ip>:3000/teacher.html` (replace `<server-ip>` with the computer’s address, e.g. `http://192.168.8.10:3000/teacher.html`).
   2. Click **Refresh devices** if the input list is empty.
   3. Pick the audio device that carries your mix (Virtual Audio Cable, USB mixer, etc.).
   4. Press **Connect & Publish Audio**. The page sends that input to LiveKit in high-quality stereo.

- **Student devices**
   1. Go to `http://<server-ip>:3000` or the friendly name (e.g. `http://classroom:3000`). The home page automatically shows the listener controls.
   2. Tap **Listen**. The page grabs a one-time access code, connects to LiveKit over the local network, and starts playing audio as soon as the teacher is live.

Up to 200 students can listen at once (you can change the limit inside `classroom.yaml`).

## Troubleshooting

- **“Token” errors** – these are the security codes given to each browser. Make sure the Node.js window (running `node server.js`) is still open, and confirm the API key/secret in `server.js` match the ones in `classroom.yaml`.
- **LiveKit script missing** – if you see `LivekitClient is not defined`, ensure `public/livekit-client.umd.min.js` exists. The file ships with this project so you can run without Internet access.
- **Can’t reach LiveKit** – from a student device, open `http://<server-ip>:7880`. If you see `ok`, the LiveKit engine is reachable. If not, check firewall rules or Wi‑Fi isolation.
