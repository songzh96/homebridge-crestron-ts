import { BaseAccessory } from "./BaseAccessory";
import { getPowerState, setPowerState } from "./Callbacks";

export class Switch extends BaseAccessory {
  switchService: any;
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

    const switchService = new Service.Switch();
    const powerState = switchService
      .getCharacteristic(Characteristic.On)
      .on("get", getPowerState.bind(this))
      .on("set", setPowerState.bind(this));

    this.switchService = switchService;

    api.on(`Event-${this.type}-${this.id}-Set-Power`, (value: any) => {
      powerState.updateValue(Boolean(value));
    });

    return [this.infoService, switchService];
  }
}
