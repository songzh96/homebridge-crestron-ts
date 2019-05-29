import { BaseAccessory } from "./BaseAccessory";
import {
  getValue, setValue, setPowerState, getPowerState
} from "./Callbacks";

export class HeaterCooler extends BaseAccessory {
  heaterCoolerService: any;
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

    const HeaterCoolerService = new Service.HeaterCooler();
    const Power = HeaterCoolerService
      .getCharacteristic(Characteristic.Active)
      .on("get", getPowerState.bind(this))
      .on("set", setPowerState.bind(this));
    const TargetHeaterCoolerState = HeaterCoolerService
      .getCharacteristic(Characteristic.TargetHeaterCoolerState)
      .on("get", getValue.bind(this))
      .on("set", setValue.bind(this));
    const CurrentHeaterCoolerState = HeaterCoolerService
      .getCharacteristic(Characteristic.CurrentHeaterCoolerState)
      .on("get", getValue.bind(this));
    const CurrentTemperature = HeaterCoolerService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .setProps({
        minValue: 16,
        maxValue: 32
      })
      .on('get', getValue.bind(this));
    const TemperatureDisplayUnits = HeaterCoolerService
      .getCharacteristic(Characteristic.TemperatureDisplayUnits)

    TemperatureDisplayUnits.setValue(0);
    this.heaterCoolerService = HeaterCoolerService;

    api.on(`Event-${this.type}-${this.id}-Set-Power`, (value: any) => {
      Power.updateValue(value);
    });

    api.on(`Event-${this.type}-${this.id}-Set-CurrValue`, (value: any) => {
      CurrentTemperature.updateValue(value);
    });

    api.on(`Event-${this.type}-${this.id}-Set-HCState`, (value: number) => {
      TargetHeaterCoolerState.updateValue(value);
      var currStateValue: number;
      if (value == 1) {
        currStateValue = 2;

      }
      else if (value == 2) {
        currStateValue = 3;

      }
      else if (value == 0) {
        currStateValue = 1;
      }
      CurrentHeaterCoolerState.updateValue(currStateValue);
    });

    return [this.infoService, HeaterCoolerService];
  }
}
