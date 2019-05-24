import { BaseAccessory } from './BaseAccessory';
import { getSensorState } from './Callbacks';

export class SmokeSensor extends BaseAccessory {
  smokeSensor: any;
  constructor(log: Function, accessoryConfig: { id: Number; type: string; name: string; manufacturer: string; model: string; }, platform: any) {
    super(log, accessoryConfig, platform);
  }

  getServices() {
    const { platform } = this;
    const { api } = platform;
    const {
      hap: { Characteristic, Service }
    } = api;

    const smokeSensorService = new Service.SmokeSensor();

    //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.
    const sensorState = smokeSensorService
      .getCharacteristic(Characteristic.SmokeDetected)
      .on('get', getSensorState.bind(this));

    this.smokeSensor = smokeSensorService;

    api.on(`Event-${this.type}-${this.id}-Get-sensorState`, (value: any) => {
      sensorState.updateValue(Boolean(value));
    });

    return [this.infoService, smokeSensorService];
  }
}
