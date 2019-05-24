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
  constructor(
    log: Function,
    accessoryConfig: {
      id: Number;
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
    this.serialnumber = this.guid(8, 16);
    this.frmwarerevision = "19-5-24";

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

  guid(len: number, radix: number) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
      ""
    );
    var uuid = [],
      i: number;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
    } else {
      // rfc4122, version 4 form
      var r: number;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
      uuid[14] = "4";

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16);
          uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join("");
  }
}
