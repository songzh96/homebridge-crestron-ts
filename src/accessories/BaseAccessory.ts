import { uuid } from "homebridge-crestron-ts/src/unit/uuid";

export class BaseAccessory {
  log: Function;
  id: Number;
  type: string;
  name: string;
  manufacturer: string;
  model: string;
  platform: any;
  infoService: any;
  serialnumber: string;
  frmwarerevision: string;
  constructor(log: Function,
    accessoryConfig: {
      id: number;
      type: string;
      name: string;
      manufacturer: string;
      model: string;
      serialnumber: string;
      frmwarerevision: string;
    },
    platform: any
  ) {
    this.log = log;
    this.id = accessoryConfig.id;
    this.type = accessoryConfig.type;
    this.name = accessoryConfig.name;
    this.manufacturer = "crestron";
    this.model = accessoryConfig.type + "ID " + accessoryConfig.id;
    this.serialnumber = uuid(8, 16);
    this.frmwarerevision = "2.0";
    this.platform = platform;
    const {
      hap: { Characteristic, Service }
    } = this.platform.api;

    const infoService = new Service.AccessoryInformation();
    infoService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.SerialNumber, this.serialnumber)
      .setCharacteristic(Characteristic.FirmwareRevision, this.frmwarerevision);

    // store the infoService in the Accessory instance
    this.infoService = infoService;
  }

  identify(callback: () => void) {
    callback();
  }
}
