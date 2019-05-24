import { BaseAccessory } from './BaseAccessory';
import {
  getFanSpeed,
  getPowerState,
  setFanSpeed,
  setPowerState
} from './Callbacks';

export class Fan extends BaseAccessory {
  fanService: any;
  constructor({
    log,
    accessoryConfig,
    platform
  }: {
    log: Function;
    accessoryConfig: {
      id: Number;
      type: string;
      name: string;
      manufacturer: string;
      model: string;
      serialnumber: string;
      frmwarerevision: string;
    };
    platform: any;
  }) {
    super(log, accessoryConfig, platform);
  }

  getServices() {
    const { platform } = this;
    const { api } = platform;
    const {
      hap: { Characteristic, Service }
    } = api;

    const fanService = new Service.Fan();
    const powerState = fanService
      .getCharacteristic(Characteristic.On)
      .on('get', getPowerState.bind(this))
      .on('set', setPowerState.bind(this));

    const fanSpeed = fanService
      .getCharacteristic(Characteristic.RotationSpeed)
      .on('get', getFanSpeed.bind(this))
      .on('set', setFanSpeed.bind(this));

    this.fanService = fanService;

    api.on(`Event-${this.type}-${this.id}-Set-Power`, (value: any) => {
      powerState.updateValue(Boolean(value));
    });

    api.on(`Event-${this.type}-${this.id}-Set-Speed`, (value: any) => {
      fanSpeed.updateValue(value);
    });

    return [this.infoService, fanService];
  }
}
