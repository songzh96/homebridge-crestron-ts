import { BaseAccessory } from "homebridge-crestron-ts/src/accessories/BaseAccessory";
import {
  getValue, setValue, setPowerState, getPowerState
} from "homebridge-crestron-ts/src/accessories/Callbacks";

export class AirPurifier extends BaseAccessory {
  airPurifierService: any;
  constructor(log: Function, accessoryConfig: { id: number; type: string; name: string; manufacturer: string; model: string; serialnumber: string; frmwarerevision: string; }, platform: any) {
    super(log, accessoryConfig, platform);
  }

  getServices() {
    const { platform } = this;
    const { api } = platform;
    const {
      hap: { Characteristic, Service }
    } = api;

    const AirPurifierService = new Service.AirPurifier();
    const Power = AirPurifierService
      .getCharacteristic(Characteristic.Active)
      .on("get", getPowerState.bind(this))
      .on("set", setPowerState.bind(this));
    const TargetAirPurifierState = AirPurifierService
      .getCharacteristic(Characteristic.TargetAirPurifierState)
      .on("get", getValue.bind(this, "TargetAirPurifierState"))
      .on("set", setValue.bind(this, "TargetAirPurifierState"));
    const CurrentAirPurifierState = AirPurifierService
      .getCharacteristic(Characteristic.CurrentAirPurifierState)
    const RotationSpeed = AirPurifierService
      .getCharacteristic(Characteristic.RotationSpeed)
      .on("get", getValue.bind(this, "RotationSpeed"))
      .on("set", setValue.bind(this, "RotationSpeed"));

    this.airPurifierService = AirPurifierService;

    api.on(`Event-${this.type}-${this.id}-Set-Power`, (value: any) => {
      Power.updateValue(value);
    });

    api.on(`Event-${this.type}-${this.id}-Set-TargetAirPurifierState`, (value: any) => {
      TargetAirPurifierState.updateValue(value);
    });

    api.on(`Event-${this.type}-${this.id}-Set-CurrentAirPurifierState`, (value: any) => {
      CurrentAirPurifierState.updateValue(value);
    });

    api.on(`Event-${this.type}-${this.id}-Set-RotationSpeed`, (value: any) => {
      RotationSpeed.updateValue(value);

    });

    return [this.infoService, AirPurifierService];
  }
}
