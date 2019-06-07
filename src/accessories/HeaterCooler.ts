import { BaseAccessory } from "./BaseAccessory";
import {
  getValue, setValue, setPowerState, getPowerState
} from "./Callbacks";

export class HeaterCooler extends BaseAccessory {
  heaterCoolerService: any;
  constructor(log: Function, accessoryConfig: { id: number; type: string; name: string; manufacturer: string; model: string; serialnumber: string; frmwarerevision: string; }, platform: any) {
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
      .on("get", getValue.bind(this, "TargetState"))
      .on("set", setValue.bind(this, "TargetState"));
    const CurrentHeaterCoolerState = HeaterCoolerService
      .getCharacteristic(Characteristic.CurrentHeaterCoolerState)
      .on("get", getValue.bind(this, "CurrentState"));
    const CurrentTemperature = HeaterCoolerService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', getValue.bind(this, "CurrentTemperature"));
    const TemperatureDisplayUnits = HeaterCoolerService
      .getCharacteristic(Characteristic.TemperatureDisplayUnits)
    const CoolingThresholdTemperature = HeaterCoolerService
      .getCharacteristic(Characteristic.CoolingThresholdTemperature)
      .setProps(
        {
          maxValue: 32,
          minValue: 16,
          minStep: 1
        }
      )
      .on('get', getValue.bind(this, "TargetTemperature"))
      .on('set', setValue.bind(this, "TargetTemperature"));
    const HeatingThresholdTemperature = HeaterCoolerService
      .getCharacteristic(Characteristic.HeatingThresholdTemperature)
      .setProps(
        {
          maxValue: 32,
          minValue: 16,
          minStep: 1
        }
      )
      .on('get', getValue.bind(this, "TargetTemperature"))
      .on('set', setValue.bind(this, "TargetTemperature"));


    TemperatureDisplayUnits.setValue(0);

    this.heaterCoolerService = HeaterCoolerService;

    api.on(`Event-${this.type}-${this.id}-Set-Power`, (value: any) => {
      Power.updateValue(value);
    });

    api.on(`Event-${this.type}-${this.id}-Set-CurrentTemperature`, (value: any) => {
      CurrentTemperature.updateValue(value);
    });

    api.on(`Event-${this.type}-${this.id}-Set-TargetTemperature`, async (value: any) => {
      await HeatingThresholdTemperature.updateValue(value);
      CoolingThresholdTemperature.updateValue(value);
    });

    api.on(`Event-${this.type}-${this.id}-Set-TargetState`, async (value: number) => {

      TargetHeaterCoolerState.updateValue(value);

      var currStateValue: number;
      if (value === 0) {
        currStateValue = 1;

      }
      else if (value === 1) {
        currStateValue = 2;

      }
      else if (value === 2) {
        currStateValue = 3;
      }
      CurrentHeaterCoolerState.updateValue(currStateValue);
    });

    return [this.infoService, HeaterCoolerService];
  }
}
