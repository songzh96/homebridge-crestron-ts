export class BaseAccessory {
  log: Function;
  id: Number;
  type: string;
  name: string;
  manufacturer: string;
  model: string;
  platform: any;
  infoService: any;
  constructor(log: Function, accessoryConfig: { id: Number; type: string; name: string; manufacturer: string; model: string; }, platform: any) {
    this.log = log;
    this.id = accessoryConfig.id;
    this.type = accessoryConfig.type;
    this.name = accessoryConfig.name;
    this.manufacturer = "cresKit";
    this.model = accessoryConfig.type;
    this.platform = platform;
    const {
      hap: { Characteristic, Service }
    } = this.platform.api;

    const infoService = new Service.AccessoryInformation();
    infoService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model);

    // store the infoService in the Accessory instance
    this.infoService = infoService;
  }

  identify(callback) {
    callback();
  }
}
