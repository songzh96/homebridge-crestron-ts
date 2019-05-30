import { BaseAccessory } from "./BaseAccessory";
import {
  getPercentageValue,setPercentageValue,PositionState
} from "./Callbacks";

export class WindowCovering extends BaseAccessory {
  windowCoveringService: any;
  constructor(log: Function, accessoryConfig: { id: number; type: string; name: string; manufacturer: string; model: string; serialnumber: string; frmwarerevision: string; }, platform: any) {
    super(log, accessoryConfig, platform);
  }

  getServices() {
    const { platform } = this;
    const { api } = platform;
    const {
      hap: { Characteristic, Service }
    } = api;

    const WindowCoveringService = new Service.WindowCovering();
    const currPosition = WindowCoveringService
      .getCharacteristic(Characteristic.CurrentPosition)
      .on("get", getPercentageValue.bind(this));
    const targetPosition = WindowCoveringService
      .getCharacteristic(Characteristic.TargetPosition)
      .on("get", getPercentageValue.bind(this))
      .on("set", setPercentageValue.bind(this));
    const positionState = WindowCoveringService
      .getCharacteristic(Characteristic.PositionState)
      .on("get", PositionState.bind(this));

    this.windowCoveringService = WindowCoveringService;

    api.on(`Event-${this.type}-${this.id}-Set-PerValue`, (value: any) => {
      targetPosition.updateValue(value);
      currPosition.updateValue(value);
    });

    api.on(`Event-${this.type}-${this.id}-Set-PositionState`, (value: number) => {
      positionState.updateValue(value);
    });

    return [this.infoService, WindowCoveringService];
  }
}
