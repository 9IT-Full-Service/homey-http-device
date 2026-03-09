'use strict';

const Homey = require('homey');

const BUTTON_COUNT = 8;

class HttpDevice extends Homey.Device {

  async onInit() {
    this.log('HTTP Device initialized:', this.getName());

    // Register capability listeners for all buttons
    for (let i = 1; i <= BUTTON_COUNT; i++) {
      const capability = `button_btn${i}`;

      if (this.hasCapability(capability)) {
        this.registerCapabilityListener(capability, async () => {
          this.log(`Button ${i} pressed`);

          // Trigger the flow card
          const triggerCard = this.homey.flow.getTriggerCard('button_pressed');
          await triggerCard.trigger(this, {}, { button_number: String(i) });

          this.log(`Flow trigger fired for button ${i}`);
        });
      }
    }

    // Register the trigger card filter
    const triggerCard = this.homey.flow.getTriggerCard('button_pressed');
    triggerCard.registerRunListener(async (args, state) => {
      // Only trigger when the button number matches
      return args.button_number === state.button_number;
    });
  }

  async onAdded() {
    this.log('HTTP Device added:', this.getName());
  }

  async onDeleted() {
    this.log('HTTP Device deleted:', this.getName());
  }

}

module.exports = HttpDevice;
