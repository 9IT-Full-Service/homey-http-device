'use strict';

const Homey = require('homey');
const http = require('http');
const https = require('https');

class HttpDeviceApp extends Homey.App {

  async onInit() {
    this.log('HTTP Device App is running');

    const makeHttpRequestAction = this.homey.flow.getActionCard('make_http_request');
    makeHttpRequestAction.registerRunListener(async (args) => {
      const { url, method, body, headers } = args;
      this.log(`Making ${method} request to ${url}`);

      const parsedHeaders = { 'Content-Type': 'application/json' };
      if (headers) {
        try {
          Object.assign(parsedHeaders, JSON.parse(headers));
        } catch (err) {
          throw new Error(`Invalid headers JSON: ${err.message}`);
        }
      }

      const result = await this._makeRequest(url, method, parsedHeaders, body);
      this.log(`Response: ${result.statusCode}`);

      if (result.statusCode >= 400) {
        throw new Error(`HTTP ${result.statusCode}`);
      }
    });
  }

  _makeRequest(url, method, headers, body) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      const req = client.request(url, { method, headers, timeout: 3000 }, (res) => {
        // Consume and discard response data to free the socket
        res.resume();
        res.on('end', () => {
          resolve({ statusCode: res.statusCode });
        });
      });

      req.on('error', (err) => reject(new Error(`Request failed: ${err.message}`)));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timed out'));
      });

      if (body && method !== 'GET') {
        req.write(body);
      }
      req.end();
    });
  }

}

module.exports = HttpDeviceApp;
