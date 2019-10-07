import { BaseAccessory } from "./BaseAccessory";
import {
  getPosition, setTargetPosition
} from "./Callbacks";
import { timeout } from "../unit/unit";

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
      .on("get", getPosition.bind(this, "CurrentPosition"));
    const targetPosition = WindowCoveringService
      .getCharacteristic(Characteristic.TargetPosition)
      .on("get", getPosition.bind(this, "TargetPosition"))
      .on("set", setTargetPosition.bind(this));
    const positionState = WindowCoveringService
      .getCharacteristic(Characteristic.PositionState)

    this.windowCoveringService = WindowCoveringService;

    api.on(`Event-${this.type}-${this.id}-Set-CurrentPosition`, async (value: any) => {
      targetPosition.updateValue(value);
          
      await timeout(5000);

      positionState.updateValue(Characteristic.PositionState.STOPPED);
      currPosition.updateValue(value);
    });

    return [this.infoService, WindowCoveringService];
  }
}
