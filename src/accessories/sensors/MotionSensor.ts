import { BaseAccessory } from '../BaseAccessory';
import { getSensorState } from '../Callbacks';

export class MotionSensor extends BaseAccessory {
  motionSensor: any;
  constructor(log: Function, accessoryConfig: { id: number; type: string; name: string; manufacturer: string; model: string; serialnumber: string; frmwarerevision: string; }, platform: any) {
    super(log, accessoryConfig, platform);
  }

  getServices() {
    const { platform } = this;
    const { api } = platform;
    const {
      hap: { Characteristic, Service }
    } = api;

    const motionSensorService = new Service.MotionSensor();

    //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.
    const sensorState = motionSensorService
      .getCharacteristic(Characteristic.MotionDetected)
      .on('get', getSensorState.bind(this));

    this.motionSensor = motionSensorService;

    api.on(`Event-${this.type}-${this.id}-Get-sensorState`, (value: any) => {
      sensorState.updateValue(Boolean(value));
    });

    return [this.infoService, motionSensorService];
  }
}
