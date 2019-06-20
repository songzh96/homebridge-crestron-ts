import { BaseAccessory } from '../BaseAccessory';
import { getSensorState } from '../Callbacks';

export class CarbonMonoxideSensor extends BaseAccessory {
  carbonMonoxideSensor: any;
  constructor(log: Function, accessoryConfig: { id: number; type: string; name: string; manufacturer: string; model: string; serialnumber: string; frmwarerevision: string; }, platform: any) {
    super(log, accessoryConfig, platform);
  }

  getServices() {
    const { platform } = this;
    const { api } = platform;
    const {
      hap: { Characteristic, Service }
    } = api;

    const CarbonMonoxideService = new Service.CarbonMonoxideSensor();

    //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.
    const sensorState = CarbonMonoxideService
      .getCharacteristic(Characteristic.CarbonMonoxideDetected)
      .on('get', getSensorState.bind(this));

    this.carbonMonoxideSensor = CarbonMonoxideService;

    api.on(`Event-${this.type}-${this.id}-Set-State`, (value: any) => {
      sensorState.updateValue(Boolean(value));
    });

    return [this.infoService, CarbonMonoxideService];
  }
}
