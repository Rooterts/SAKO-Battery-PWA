# SAKO Battery Pro

> Real-time BLE monitor for SAKO / JBD battery management systems.

[**→ Live Demo**](https://rooterts.github.io/SAKO-Battery-PWA/)

[![Web Bluetooth](https://img.shields.io/badge/Web_Bluetooth-Required-0066cc?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Windows%20%7C%20ChromeOS-blue?style=flat-square)](https://github.com/Rooterts/SAKO-Battery-PWA)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## Features

| | |
|---|---|
| 🔋 **Live Dashboard** | SVG SOC ring, voltage, current, power, NTC temperatures |
| 📊 **History + Chart** | V / I / SOC trends with interactive tooltip |
| 🔬 **Hex Inspector** | Full 0x03 packet dump + field-level decoding |
| 💾 **Offline Persistence** | IndexedDB · up to 5,000 readings with auto-pruning |
| 📱 **Installable PWA** | Custom icon, standalone, works offline via GitHub Pages |
| 🔄 **Auto-reconnect** | Remembers last BLE device and reconnects on load |
| 📤 **CSV Export** | Download all data for external analysis |
| 🧭 **Pull-to-refresh** | Swipe down to force a sync |
| 🌐 **Bilingual UI** | English / Spanish — auto-detected from browser |

---

## Requirements

- **Browser with Web Bluetooth**: Chrome 56+ · Edge 79+ · Samsung Internet 6.0+ · Opera 43+
- **OS**: Android 8+ (Chrome) · Windows 10/11 (Chrome/Edge) · ChromeOS
- **Hardware**: Battery must have an integrated BLE module (most JBD/SOK/Elego BMS units use HC-08 or similar)

> ⚠️ **iOS / Safari is not supported** — Web Bluetooth is not available in Safari as of 2025.

---

## Quick Start

1. Open the app: **https://rooterts.github.io/SAKO-Battery-PWA/**
2. Tap **"Connect SAKO battery"**
3. Select your battery from the BLE dialog
4. Data appears on the dashboard immediately

### Install as a native app

**Android (Chrome):**
- Tap ⋮ → "Add to Home Screen"
- The app installs as a native icon and works **fully offline**.

**Windows (Chrome/Edge):**
- Tap ⋮ → "Install SAKO Battery Pro"
- Opens as a standalone window on your desktop.

---

## BLE Protocol

| Parameter | Value |
|---|---|
| **GATT Service** | `0xFF00` (standard JBD) |
| **TX Characteristic** | `0xFF01` (send commands) |
| **RX Characteristic** | `0xFF02` (receive data) |
| **Info command** | `DD A5 03 00 FF FD 77` |
| **Checksum** | Standard JBD / SAKO variants (dual compatibility) |

**Response packet format (0x03):**

```
Offset  Field                Type      Description
─────────────────────────────────────────────────────
 0-1    Voltage              u16/100   Total voltage (V)
 2-3    Current             i16/100   Current (A), signed
 4-5    Capacity remaining  u16/100   Remaining capacity (Ah)
 6-7    Capacity total      u16/100   Nominal capacity (Ah)
 8-9    Cycles              u16       Charge cycle count
 10-11  Production date     u16       Manufacturing date
 12-13  Balance status low  u16       Balance state (low word)
 14-15  Balance status high u16       Balance state (high word)
 16     Protection status   u8        Protection flags
 17     SW version          u8        Firmware version (/10)
 18     RSOC                u8        State of charge (%)
 19     FET status          u8        Charge/discharge MOSFETs
 20     Cell count          u8        Number of cells (S)
 21     NTC bytes           u8        NTC sensors (2 per byte)
 22+    Temperatures        u16/10-273.15 °C per sensor
```

---

## Local Development

```bash
git clone https://github.com/Rooterts/SAKO-Battery-PWA.git
cd SAKO-Battery-PWA
python3 -m http.server 8080
# Open http://localhost:8080
```

> The Service Worker requires **HTTPS** or **localhost** — it will not run from `file://`.

---

## Project Structure

```
SAKO-Battery-PWA/
├── index.html              # HTML shell (no inline CSS/JS)
├── manifest.webmanifest    # PWA manifest (name, icons, shortcuts)
├── sw.js                   # Service Worker (precache, cache-first)
├── assets/
│   ├── css/
│   │   └── styles.css      # All styles
│   ├── js/
│   │   └── app.js         # Full logic (BLE, IndexedDB, charts, hex inspector)
│   └── icons/
│       ├── icon.svg               # Vector icon (any size)
│       ├── icon-192.png
│       ├── icon-512.png
│       └── icon-512-maskable.png  # Android safe-area aware
├── README.md
├── LICENSE                 # MIT
├── .gitignore
└── .nojekyll              # Required for GitHub Pages
```

---

## License

MIT © 2025 [Adrián Pérez Pérez (@Rooterts)](https://github.com/Rooterts)