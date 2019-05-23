import { BaseAccessory } from './BaseAccessory';
import { getPowerState, setPowerState } from './Callbacks';

export class LightSwitch extends BaseAccessory {
  lightBulbService: any;
  constructor(log: Function, accessoryConfig: { id: Number; type: string; name: string; manufacturer: string; model: string; }, platform: any) {
    super(log, accessoryConfig, platform);
  }

  getServices() {
    const { platform } = this;
    const { api } = platform;
    const {
      hap: { Characteristic, Service }
    } = api;

    const lightBulbService = new Service.Lightbulb();
    const powerState = lightBulbService
      .getCharacteristic(Characteristic.On)
      .on('get', getPowerState.bind(this))
      .on('set', setPowerState.bind(this));

    this.lightBulbService = lightBulbService;

    api.on(`Event-${this.type}-${this.id}-Set-Power`, (value: any) => {
      powerState.updateValue(Boolean(value));
    });

    return [this.infoService, lightBulbService];
  }
}
