import { BaseAccessory } from '../BaseAccessory';
import { getSensorState } from '../Callbacks';

export class LeakSensor extends BaseAccessory {
  leakSensor: any;
  constructor({
    log,
    accessoryConfig,
    platform
  }: {
    log: Function;
    accessoryConfig: {
      id: number;
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

    const leakSensorService = new Service.LeakSensor();

    //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.
    const sensorState = leakSensorService
      .getCharacteristic(Characteristic.LeakDetected)
      .on('get', getSensorState.bind(this));

    this.leakSensor = leakSensorService;

    api.on(`Event-${this.type}-${this.id}-Get-sensorState`, (value: any) => {
      sensorState.updateValue(Boolean(value));
    });

    return [this.infoService, leakSensorService];
  }
}
