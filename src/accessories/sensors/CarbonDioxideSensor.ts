import { BaseAccessory } from '../BaseAccessory';
import { getSensorState } from '../Callbacks';

export class CarbonDioxideSensor extends BaseAccessory {
  carbonDioxideSensor: any;
  constructor(log: Function, accessoryConfig: { id: number; type: string; name: string; manufacturer: string; model: string; serialnumber: string; frmwarerevision: string; }, platform: any) {
    super(log, accessoryConfig, platform);
  }

  getServices() {
    const { platform } = this;
    const { api } = platform;
    const {
      hap: { Characteristic, Service }
    } = api;

    const CarbonDioxideService = new Service.CarbonDioxideSensor();

    //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.
    const sensorState = CarbonDioxideService
      .getCharacteristic(Characteristic.CarbonDioxideDetected)
      .on('get', getSensorState.bind(this));

    this.carbonDioxideSensor = CarbonDioxideService;

    api.on(`Event-${this.type}-${this.id}-Set-State`, (value: any) => {
      sensorState.updateValue(Boolean(value));
    });

    return [this.infoService, CarbonDioxideService];
  }
}
