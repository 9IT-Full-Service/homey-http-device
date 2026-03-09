# HTTP Device for Homey

Virtuelles Homey-Device mit 8 konfigurierbaren Buttons, das HTTP-Requests ueber Homey-Flows ausloesen kann.

## Was macht die App?

Homey unterstuetzt von Haus aus keine HTTP-Requests in Flows. Diese App schliesst diese Luecke:

- **Virtuelles Device** mit 8 Buttons, die in der Homey-UI sichtbar und drueckbar sind
- **Flow Trigger**: "Button X wurde gedrueckt" — als Ausloeser fuer beliebige Flows
- **Flow Action**: "HTTP Request ausfuehren" — sendet GET, POST, PUT, DELETE oder PATCH Requests mit konfigurierbarer URL, Body und Headers

## Flow-Beispiele

### Einfacher GET-Request per Button
```
WENN:   Button 1 auf "HTTP Device" gedrueckt wird
DANN:   GET-Request an https://api.example.com/trigger senden
```

### POST-Request mit JSON-Body
```
WENN:   Button 2 auf "HTTP Device" gedrueckt wird
DANN:   POST-Request an https://api.example.com/action
        Body: {"command": "toggle_light"}
        Headers: {"Authorization": "Bearer token123"}
```

### Kombination mit anderen Devices
```
WENN:   Temperatur-Sensor meldet > 25°C
DANN:   POST-Request an https://hooks.example.com/notify
        Body: {"message": "Temperatur zu hoch!"}
```

## Flow Action Parameter

| Parameter | Typ | Pflicht | Beschreibung |
|-----------|-----|---------|--------------|
| URL | Text | Ja | Ziel-URL fuer den HTTP-Request |
| Methode | Dropdown | Ja | GET, POST, PUT, DELETE, PATCH |
| Body | Text | Nein | Request-Body (z.B. JSON-String) |
| Headers | Text | Nein | Zusaetzliche Headers als JSON-String |

## Installation

```bash
cd homey-http-device

# 1. Homey CLI installieren (falls noch nicht vorhanden)
npm install -g homey

# 2. Bei Homey einloggen
homey login

# 3. App auf dem Homey testen
homey app run

# 4. App dauerhaft installieren
homey app install
```

## Device hinzufuegen

1. Homey App oeffnen
2. Devices → **+** → HTTP Device
3. "HTTP Device" auswaehlen und hinzufuegen
4. Die 8 Buttons erscheinen im Device

## Projektstruktur

```
homey-http-device/
├── app.json                          # App-Manifest
├── app.js                            # Flow-Action-Handler (HTTP fetch)
├── drivers/http-device/
│   ├── driver.js                     # Pairing (virtuelles Device)
│   ├── device.js                     # 8 Button-Capabilities + Flow-Trigger
│   └── assets/icon.svg
├── assets/icon.svg
├── locales/{en,de}.json
└── package.json
```
