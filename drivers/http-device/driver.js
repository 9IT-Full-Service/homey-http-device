'use strict';

const Homey = require('homey');

class HttpDeviceDriver extends Homey.Driver {

  async onInit() {
    this.log('HTTP Device Driver initialized');
  }

  async onPairListDevices() {
    // Offer a single virtual device to add
    return [
      {
        name: 'HTTP Device',
        data: {
          id: `http-device-${Date.now()}`,
        },
      },
    ];
  }

}

module.exports = HttpDeviceDriver;
