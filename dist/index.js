'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var net = _interopDefault(require('net'));

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    _defineProperty(this, "log", void 0);

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "manufacturer", void 0);

    _defineProperty(this, "model", void 0);

    _defineProperty(this, "platform", void 0);

    _defineProperty(this, "infoService", void 0);

    _defineProperty(this, "serialnumber", void 0);

    _defineProperty(this, "frmwarerevision", void 0);

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
      hap: {
        Characteristic,
        Service
      }
    } = this.platform.api;
    const infoService = new Service.AccessoryInformation();
    infoService.setCharacteristic(Characteristic.Manufacturer, this.manufacturer).setCharacteristic(Characteristic.Model, this.model).setCharacteristic(Characteristic.SerialNumber, this.serialnumber).setCharacteristic(Characteristic.FirmwareRevision, this.frmwarerevision); // store the infoService in the Accessory instance

    this.infoService = infoService;
  }

  identify(callback) {
    callback();
  }

  guid(len, radix) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    var uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      var r; // rfc4122 requires these characters

      uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
      uuid[14] = "4"; // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5

      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
        }
      }
    }

    return uuid.join("");
  }

}

function getPowerState(callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "Power"
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(`${this.type}-${this.id}-Power`, jsonMessage); // handle response to `Get` Power requests

  api.once(`Response-${this.type}-${this.id}-Get-Power`, value => {
    platform.socket.pendingGetRequests.delete(`${this.type}-${this.id}-Power`);
    const powered = Boolean(value);
    callback(null, powered);
  });
}
function setPowerState(powered, callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Set",
    Property: "Power",
    Value: powered ? 1 : 0
  })}||`;
  /*
    Logic to handle Apple's Home app Dimmer behavior:
      Apple's Home app sets a Power and Brightness characteristic when interacting
    with dimmer controls. If both `Power` and `Level` messages are received by
    Crestron in rapid succession, the Brightness/Level setting may be lost due to
    a potential analog ramp triggered on the dimmer.
      (Note: When powering off the dimmer, only the Power is set and no Brightness
    is set)
      To work around this behavior, we first check if the `Set Power` command is
    from a dimmer and if the command is to `Power On` the device. If the device
    is already powered on, we stop any further processing and notify Homebridge.
    We check on the device's `On` state by reading the value from the `On`
    characteristic in the `lighBulbService`.
      If the device is off, we pause processing for 50 ms and wait for a `Set Level`
    event to fire for the same device. If no event is fired for `Set Level`, we
    will process the `Set Power` request, otherwise we simply notify Homebridge
    that the `Set Power` was successful and we delegate the command to the
    Brightness characteristic. The above logic also applies to Fans and rotation
    speed.
   */

  if ((this.type === "LightDimmer" || this.type === "Fan") && powered) {
    let isLevelAlsoSet = false;

    if (this.type === "LightDimmer" && this.lightBulbService.characteristics[0].value || this.type === "Fan" && this.fanService.characteristics[0].value) {
      callback();
      return;
    }

    setTimeout(() => {
      if (!isLevelAlsoSet) {
        this.platform.socket.write(jsonMessage);
        platform.socket.pendingSetRequests.set(`${this.type}-${this.id}-Power`, jsonMessage);
        api.once(`Response-${this.type}-${this.id}-Set-Power`, () => {
          platform.socket.pendingSetRequests.delete(`${this.type}-${this.id}-Power`);
          callback();
        });
      } else {
        callback();
      }
    }, 50);
    api.once(`Request-${this.type}-${this.id}-Set-Level`, () => {
      isLevelAlsoSet = true;
    });
  } else {
    this.platform.socket.write(jsonMessage);
    platform.socket.pendingSetRequests.set(`${this.type}-${this.id}-Power`, jsonMessage);
    api.once(`Response-${this.type}-${this.id}-Set-Power`, () => {
      platform.socket.pendingSetRequests.delete(`${this.type}-${this.id}-Power`);
      callback();
    });
  }
}
function getLightLevel(callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "Level"
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(`${this.type}-${this.id}-Level`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Get-Level`, value => {
    platform.socket.pendingGetRequests.delete(`${this.type}-${this.id}-Level`);
    const percentLevel = value * 100 / 65535;
    callback(null, percentLevel);
  });
}
function setLightLevel(percentLevel, callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Set",
    Property: "Level",
    Value: percentLevel / 100 * 65535
  })}||`;
  this.platform.socket.write(jsonMessage);
  api.emit(`Request-${this.type}-${this.id}-Set-Level`);
  platform.socket.pendingSetRequests.set(`${this.type}-${this.id}-Level`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Set-Level`, () => {
    platform.socket.pendingSetRequests.delete(`${this.type}-${this.id}-Level`);
    callback();
  });
}
/**
 * getPercentageValue  
 * PercentageValue:0-100
 * include this Characteristic
 * ---- BatteryLevel,Brightness,CarbonMonoxideLevel,CarbonMonoxidePeakLevel
 * ---- CurrentPosition,CurrentRelativeHumidity ,CurrentTemperature,FilterLifeLevel
 * ---- RelativeHumidityDehumidifierThreshold 
 * ---- RelativeHumidityHumidifierThreshold 
 * ---- RotationSpeed
 * ---- Saturation TargetPosition TargetRelativeHumidity Volume WaterLevel 
 * @param callback 
 */

function getPercentageValue(callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "PerValue"
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(`${this.type}-${this.id}-PerValue`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Get-PerValue`, value => {
    platform.socket.pendingGetRequests.delete(`${this.type}-${this.id}-PerValue`);
    const pervalue = value;
    callback(null, pervalue);
  });
}
/**
 * setPercentageValue
 * PercentageValue:0-100
 * include this Characteristic
 * ---- Brightness
 * ---- RelativeHumidityDehumidifierThreshold 
 * ---- RelativeHumidityHumidifierThreshold 
 * ---- RotationSpeed
 * ---- Saturation TargetPosition TargetRelativeHumidity Volume  
 * @param pervalue 
 * @param callback 
 */

function setPercentageValue(pervalue, callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Set",
    Property: "PerValue",
    Value: pervalue
  })}||`;
  this.platform.socket.write(jsonMessage);
  api.emit(`Request-${this.type}-${this.id}-Set-PerValue`);
  platform.socket.pendingSetRequests.set(`${this.type}-${this.id}-PerValue`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Set-PerValue`, () => {
    platform.socket.pendingSetRequests.delete(`${this.type}-${this.id}-PerValue`);
    callback();
  });
}
/**
 * DECREASING 0;
 * INCREASING 1;
 * STOPPED 2;
 * @param callback 
 */

function PositionState(callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "PostionState"
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(`${this.type}-${this.id}-PostionState`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Get-PostionState`, value => {
    platform.socket.pendingGetRequests.delete(`${this.type}-${this.id}-PostionState`);
    const postion = value;
    callback(null, postion);
  });
}
/**
 * getSensorState
 * DETECTED 1
 * NOT_DETECTED 0 
 * @param callback 
 */

function getSensorState(callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "SensorState"
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(`${this.type}-${this.id}-SensorState`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Get-SensorState`, value => {
    platform.socket.pendingGetRequests.delete(`${this.type}-${this.id}-SensorState`);
    const state = value;
    callback(null, state);
  });
}
/**
 * Because the type and id,the function directly to avoid code redundancy.
 * This function contains a lot of HAP Characteristic, you can refer to this document(https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js#L1580)
 * @param callback 
 */

function getValue(callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "Value"
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(`${this.type}-${this.id}-Value`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Get-Value`, value => {
    platform.socket.pendingGetRequests.delete(`${this.type}-${this.id}-Value`);
    const r_value = value;
    callback(null, r_value);
  });
}
/**
 * 
 * @param value 
 * @param callback 
 */

function setValue(value, callback) {
  const {
    platform
  } = this;
  const {
    api
  } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Set",
    Property: "Value",
    Value: value
  })}||`;
  this.platform.socket.write(jsonMessage);
  api.emit(`Request-${this.type}-${this.id}-Set-Value`);
  platform.socket.pendingSetRequests.set(`${this.type}-${this.id}-Value`, jsonMessage);
  api.once(`Response-${this.type}-${this.id}-Set-Value`, () => {
    platform.socket.pendingSetRequests.delete(`${this.type}-${this.id}-Value`);
    callback();
  });
}

class Fan extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "fanService", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const fanService = new Service.Fan();
    const powerState = fanService.getCharacteristic(Characteristic.On).on('get', getPowerState.bind(this)).on('set', setPowerState.bind(this));
    const fanSpeed = fanService.getCharacteristic(Characteristic.RotationSpeed).on('get', getPercentageValue.bind(this)).on('set', setPercentageValue.bind(this));
    this.fanService = fanService;
    api.on(`Event-${this.type}-${this.id}-Set-Power`, value => {
      powerState.updateValue(Boolean(value));
    });
    api.on(`Event-${this.type}-${this.id}-Set-Speed`, value => {
      fanSpeed.updateValue(value);
    });
    return [this.infoService, fanService];
  }

}

class Switch extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "switchService", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const switchService = new Service.Switch();
    const powerState = switchService.getCharacteristic(Characteristic.On).on("get", getPowerState.bind(this)).on("set", setPowerState.bind(this));
    this.switchService = switchService;
    api.on(`Event-${this.type}-${this.id}-Set-Power`, value => {
      powerState.updateValue(Boolean(value));
    });
    return [this.infoService, switchService];
  }

}

class LightDimmer extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "lightBulbService", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const lightBulbService = new Service.Lightbulb();
    const powerState = lightBulbService.getCharacteristic(Characteristic.On).on('get', getPowerState.bind(this)).on('set', setPowerState.bind(this));
    const lightLevel = lightBulbService.getCharacteristic(Characteristic.Brightness).on('get', getLightLevel.bind(this)).on('set', setLightLevel.bind(this));
    this.lightBulbService = lightBulbService;
    api.on(`Event-${this.type}-${this.id}-Set-Power`, value => {
      powerState.updateValue(Boolean(value));
    });
    api.on(`Event-${this.type}-${this.id}-Set-Level`, value => {
      lightLevel.updateValue(value * 100 / 65535);
    });
    return [this.infoService, lightBulbService];
  }

}

class LightSwitch extends BaseAccessory {
  constructor(log, accessoryConfig, platform) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "lightBulbService", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const lightBulbService = new Service.Lightbulb();
    const powerState = lightBulbService.getCharacteristic(Characteristic.On).on('get', getPowerState.bind(this)).on('set', setPowerState.bind(this));
    this.lightBulbService = lightBulbService;
    api.on(`Event-${this.type}-${this.id}-Set-Power`, value => {
      powerState.updateValue(Boolean(value));
    });
    return [this.infoService, lightBulbService];
  }

}

class WindowCovering extends BaseAccessory {
  constructor({
    log,
    accessoryConfig,
    platform
  }) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "windowCoveringService", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const WindowCoveringService = new Service.WindowCovering();
    const currPosition = WindowCoveringService.getCharacteristic(Characteristic.CurrentPosition).on("get", getPercentageValue.bind(this));
    const targetPosition = WindowCoveringService.getCharacteristic(Characteristic.TargetPosition).on("get", getPercentageValue.bind(this)).on("set", setPercentageValue.bind(this));
    const positionState = WindowCoveringService.getCharacteristic(Characteristic.PositionState).on("get", PositionState.bind(this));
    this.windowCoveringService = WindowCoveringService;
    api.on(`Event-${this.type}-${this.id}-Set-PerValue`, value => {
      targetPosition.updateValue(value);
      currPosition.updateValue(value);
    });
    api.on(`Event-${this.type}-${this.id}-Set-PositionState`, value => {
      positionState.updateValue(value);
    });
    return [this.infoService, WindowCoveringService];
  }

}

class HeaterCooler extends BaseAccessory {
  constructor({
    log,
    accessoryConfig,
    platform
  }) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "heaterCoolerService", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const HeaterCoolerService = new Service.HeaterCooler();
    const Power = HeaterCoolerService.getCharacteristic(Characteristic.Active).on("get", getPowerState.bind(this)).on("set", setPowerState.bind(this));
    const TargetHeaterCoolerState = HeaterCoolerService.getCharacteristic(Characteristic.TargetHeaterCoolerState).on("get", getValue.bind(this)).on("set", setValue.bind(this));
    const CurrentHeaterCoolerState = HeaterCoolerService.getCharacteristic(Characteristic.CurrentHeaterCoolerState).on("get", getValue.bind(this));
    const CurrentTemperature = HeaterCoolerService.getCharacteristic(Characteristic.CurrentTemperature).setProps({
      minValue: 16,
      maxValue: 32
    }).on('get', getValue.bind(this));
    const TemperatureDisplayUnits = HeaterCoolerService.getCharacteristic(Characteristic.TemperatureDisplayUnits);
    TemperatureDisplayUnits.setValue(0);
    this.heaterCoolerService = HeaterCoolerService;
    api.on(`Event-${this.type}-${this.id}-Set-Power`, value => {
      Power.updateValue(value);
    });
    api.on(`Event-${this.type}-${this.id}-Set-CurrValue`, value => {
      CurrentTemperature.updateValue(value);
    });
    api.on(`Event-${this.type}-${this.id}-Set-HCState`, value => {
      TargetHeaterCoolerState.updateValue(value);
      var currStateValue;

      if (value == 1) {
        currStateValue = 2;
      } else if (value == 2) {
        currStateValue = 3;
      } else if (value == 0) {
        currStateValue = 1;
      }

      CurrentHeaterCoolerState.updateValue(currStateValue);
    });
    return [this.infoService, HeaterCoolerService];
  }

}

class OccupancySensor extends BaseAccessory {
  constructor({
    log,
    accessoryConfig,
    platform
  }) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "occupancySensor", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const OccupancySensorService = new Service.OccupancySensor(); //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.

    const sensorState = OccupancySensorService.getCharacteristic(Characteristic.OccupancyDetected).on("get", getSensorState.bind(this));
    this.occupancySensor = OccupancySensorService;
    api.on(`Event-${this.type}-${this.id}-Get-sensorState`, value => {
      sensorState.updateValue(Boolean(value));
    });
    return [this.infoService, OccupancySensorService];
  }

}

class MotionSensor extends BaseAccessory {
  constructor({
    log,
    accessoryConfig,
    platform
  }) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "motionSensor", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const motionSensorService = new Service.MotionSensor(); //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.

    const sensorState = motionSensorService.getCharacteristic(Characteristic.MotionDetected).on('get', getSensorState.bind(this));
    this.motionSensor = motionSensorService;
    api.on(`Event-${this.type}-${this.id}-Get-sensorState`, value => {
      sensorState.updateValue(Boolean(value));
    });
    return [this.infoService, motionSensorService];
  }

}

class LeakSensor extends BaseAccessory {
  constructor({
    log,
    accessoryConfig,
    platform
  }) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "leakSensor", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const leakSensorService = new Service.LeakSensor(); //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.

    const sensorState = leakSensorService.getCharacteristic(Characteristic.LeakDetected).on('get', getSensorState.bind(this));
    this.leakSensor = leakSensorService;
    api.on(`Event-${this.type}-${this.id}-Get-sensorState`, value => {
      sensorState.updateValue(Boolean(value));
    });
    return [this.infoService, leakSensorService];
  }

}

class ContactSensor extends BaseAccessory {
  constructor({
    log,
    accessoryConfig,
    platform
  }) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "contactSensor", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const contactService = new Service.ContactSensor(); //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.

    const sensorState = contactService.getCharacteristic(Characteristic.ContactSensorState).on('get', getSensorState.bind(this));
    this.contactSensor = contactService;
    api.on(`Event-${this.type}-${this.id}-Get-sensorState`, value => {
      sensorState.updateValue(Boolean(value));
    });
    return [this.infoService, contactService];
  }

}

class CarbonMonoxideSensor extends BaseAccessory {
  constructor({
    log,
    accessoryConfig,
    platform
  }) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "carbonMonoxideSensor", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const CarbonMonoxideService = new Service.CarbonMonoxideSensor(); //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.

    const sensorState = CarbonMonoxideService.getCharacteristic(Characteristic.CarbonMonoxideDetected).on('get', getSensorState.bind(this));
    this.carbonMonoxideSensor = CarbonMonoxideService;
    api.on(`Event-${this.type}-${this.id}-Get-sensorState`, value => {
      sensorState.updateValue(Boolean(value));
    });
    return [this.infoService, CarbonMonoxideService];
  }

}

class CarbonDioxideSensor extends BaseAccessory {
  constructor({
    log,
    accessoryConfig,
    platform
  }) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "carbonDioxideSensor", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const CarbonDioxideService = new Service.CarbonDioxideSensor(); //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.

    const sensorState = CarbonDioxideService.getCharacteristic(Characteristic.CarbonDioxideDetected).on('get', getSensorState.bind(this));
    this.carbonDioxideSensor = CarbonDioxideService;
    api.on(`Event-${this.type}-${this.id}-Get-sensorState`, value => {
      sensorState.updateValue(Boolean(value));
    });
    return [this.infoService, CarbonDioxideService];
  }

}

class SmokeSensor extends BaseAccessory {
  constructor({
    log,
    accessoryConfig,
    platform
  }) {
    super(log, accessoryConfig, platform);

    _defineProperty(this, "smokeSensor", void 0);
  }

  getServices() {
    const {
      platform
    } = this;
    const {
      api
    } = platform;
    const {
      hap: {
        Characteristic,
        Service
      }
    } = api;
    const smokeSensorService = new Service.SmokeSensor(); //  Because OccupancyDetected's Characteristic is only 0 and 1, use powerState to avoid code redundancy.

    const sensorState = smokeSensorService.getCharacteristic(Characteristic.SmokeDetected).on('get', getSensorState.bind(this));
    this.smokeSensor = smokeSensorService;
    api.on(`Event-${this.type}-${this.id}-Get-sensorState`, value => {
      sensorState.updateValue(Boolean(value));
    });
    return [this.infoService, smokeSensorService];
  }

}

const groupBy = require('lodash');

const each = require('lodash');

function index (homebridge) {
  homebridge.registerPlatform('homebridge-crestron', 'Crestron', Platform);
}

class Platform {
  constructor(log, config, api) {
    _defineProperty(this, "log", void 0);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "api", void 0);

    _defineProperty(this, "socket", void 0);

    this.log = log;
    this.config = config;
    this.api = api; // store the api in the Platform instance

    const {
      host,
      port
    } = this.config;
    this.socket = new net.Socket();
    this.socket.pendingGetRequests = new Map(); // stores outgoing get messages

    this.socket.pendingSetRequests = new Map(); // stores outgoing set messages

    this.socket.on('error', console.error); // logs socket error messages
    //handle socket close

    this.socket.on('close', () => {
      this.log('Connection Lost. Attempting to reconnect in 10 seconds...');
      this.socket.setTimeout(10000, () => {
        this.socket.connect(port, host, () => {
          this.log('Connection re-established with the Crestron Processor');
        });
      });
    }); // connect to the Crestron processor

    this.socket.connect(port, host, () => {
      this.log(`Connected to the Crestron Processor @ ${host}`);
    }); // Retry pending `Get` and `Set` Requests every 2 seconds

    setInterval(() => {
      if (!this.socket.pending) {
        if (this.socket.pendingGetRequests.size > 0) {
          this.socket.pendingGetRequests.forEach((value, key) => {
            this.log(`Retrying get request: ${key}`);
            this.socket.write(value);
          });
        }

        if (this.socket.pendingSetRequests.size > 0) {
          this.socket.pendingSetRequests.forEach((value, key) => {
            this.log(`Retrying set request: ${key}`);
            this.socket.write(value);
          });
        }
      }
    }, 2000);
    /*
      Handle messages received from Crestron
      Since messages are received in a TCP socket stream, we use a double-pipe (||)
      to delimit them. We split the stream and retain messages where length > 0
     */

    this.socket.on('data', data => {
      const jsonMessages = data.toString().split('||').filter(jsonMessage => jsonMessage.length > 0);
      jsonMessages.forEach(jsonMessage => {
        const message = JSON.parse(jsonMessage);
        const {
          MessageType: messageType,
          DeviceType: deviceType,
          DeviceId: deviceId,
          Operation: operation,
          Property: property,
          Value: value
        } = message;
        /*
          When Homebridge sends a message with a `Set` operation, the Crestron
          module will pulse DIGITAL_OUTPUT or a ANALOG_OUTPUT signals. These 
          signals will trigger commands on the connected devices and feedback 
          from those devices will be generate `Event` messages back to Homebridge.
          
          Upon receiving an `Event` message, we check if a `Set` request is pending
          for that device. If the pending request exists, we emit a `Response` event
          so that Homebridge receives the acknowledgement from Crestron that the 
          message was processes.
          
          If an `Event` message is received and there are no pending `Set` requests,
          this means that an event occurred on the Crestron side from an action
          not triggered by Homebridge (e.g. Keypad press). In this case, we emit a
          `Event` event and handle it accordingly. 
         */

        if (messageType === 'Event' && this.socket.pendingSetRequests.has(`${deviceType}-${deviceId}-${property}`)) {
          this.api.emit(`Response-${deviceType}-${deviceId}-${operation}-${property}`);
          return;
        }

        this.api.emit(`${messageType}-${deviceType}-${deviceId}-${operation}-${property}`, value);
      });
    }); // handle program termination

    process.on('exit', () => {
      this.socket.end();
      this.log('Disconnected from the Crestron Processor');
    }); // handle Homebridge launch

    this.api.on('didFinishLaunching', function () {
      this.log('DidFinishLaunching');
    }.bind(this));
  }

  accessories(callback) {
    const accessories = [];
    const {
      devices
    } = this.config;
    const devicesByType = groupBy(devices, 'type');
    console.log(devicesByType.__wrapped__);
    /*
      Here we register the devices with Homebridge. We group the devices listed
      in the config file by type and we call the appropriate accessory constructor.
     */

    devicesByType.__wrapped__.forEach(device => {
      console.log(device);

      switch (device.type) {
        case 'LightSwitch':
          console.log(123);
          accessories.push(new LightSwitch(this.log, device, this));
          return;

        case 'LightDimmer':
          accessories.push(new LightDimmer(this.log, device, this));
          return;

        case 'Switch':
          accessories.push(new Switch(this.log, device, this));
          return;

        case 'Fan':
          accessories.push(new Fan(this.log, device, this));
          return;

        case 'WindowCovering':
          accessories.push(new WindowCovering(device));
          return;

        case 'HeaterCooler':
          accessories.push(new HeaterCooler(device));
          return;

        case 'OccupancySensor':
          accessories.push(new OccupancySensor(device));
          return;

        case 'SmokeSensor':
          accessories.push(new SmokeSensor(device));
          return;

        case 'LeakSensor':
          accessories.push(new LeakSensor(device));
          return;

        case 'MotionSensor':
          accessories.push(new MotionSensor(device));
          return;

        case 'ContactSensor':
          accessories.push(new ContactSensor(device));
          return;

        case 'CarbonMonoxideSensor':
          accessories.push(new CarbonMonoxideSensor(device));
          return;

        case 'CarbonDioxideSensor':
          accessories.push(new CarbonDioxideSensor(device));
          return;
      }
    });

    callback(accessories);
  }

}

module.exports = index;
