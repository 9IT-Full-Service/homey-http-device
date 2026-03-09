# HTTP Device for Homey

Virtual Homey device with 8 configurable buttons that can trigger HTTP requests via Homey Flows.

## What does this app do?

Homey does not natively support HTTP requests in Flows. This app fills that gap:

- **Virtual Device** with 8 buttons, visible and pressable in the Homey UI
- **Flow Trigger**: "Button X was pressed" — use as a trigger for any flow
- **Flow Action**: "Make HTTP request" — sends GET, POST, PUT, DELETE or PATCH requests with configurable URL, body and headers

## Flow Examples

### Simple GET request via button
```
WHEN:   Button 1 on "HTTP Device" is pressed
THEN:   Send GET request to https://api.example.com/trigger
```

### POST request with JSON body
```
WHEN:   Button 2 on "HTTP Device" is pressed
THEN:   Send POST request to https://api.example.com/action
        Body: {"command": "toggle_light"}
        Headers: {"Authorization": "Bearer token123"}
```

### Combination with other devices
```
WHEN:   Temperature sensor reports > 25°C
THEN:   Send POST request to https://hooks.example.com/notify
        Body: {"message": "Temperature too high!"}
```

## Flow Action Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| URL | Text | Yes | Target URL for the HTTP request |
| Method | Dropdown | Yes | GET, POST, PUT, DELETE, PATCH |
| Body | Text | No | Request body (e.g. JSON string) |
| Headers | Text | No | Additional headers as JSON string |

## Installation

```bash
cd homey-http-device

# 1. Install Homey CLI (if not already installed)
npm install -g homey

# 2. Log in to Homey
homey login

# 3. Test the app on your Homey
homey app run

# 4. Install the app permanently
homey app install
```

## Adding a device

1. Open the Homey app
2. Devices → **+** → HTTP Device
3. Select "HTTP Device" and add it
4. The 8 buttons will appear on the device

## Project Structure

```
homey-http-device/
├── app.json                          # App manifest
├── app.js                            # Flow action handler (HTTP requests)
├── drivers/http-device/
│   ├── driver.js                     # Pairing (virtual device)
│   ├── device.js                     # 8 button capabilities + flow trigger
│   └── assets/icon.svg
├── assets/icon.svg
├── locales/{en,de}.json
└── package.json
```
