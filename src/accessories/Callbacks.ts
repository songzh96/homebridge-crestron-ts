export function getPowerState(callback: (arg0: any, arg1: boolean) => void) {
  const { platform } = this;
  const { api } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "Power"
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(
    `${this.type}-${this.id}-Power`,
    jsonMessage
  );

  // handle response to `Get` Power requests
  api.once(`Response-${this.type}-${this.id}-Get-Power`, (value: any) => {
    platform.socket.pendingGetRequests.delete(`${this.type}-${this.id}-Power`);
    const powered = Boolean(value);
    callback(null, powered);
  });
}

export function setPowerState(
  powered: any,
  callback: { (): void; (): void; (): void; (): void }
) {
  const { platform } = this;
  const { api } = platform;
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

    if (
      (this.type === "LightDimmer" &&
        this.lightBulbService.characteristics[0].value) ||
      (this.type === "Fan" && this.fanService.characteristics[0].value)
    ) {
      callback();

      return;
    }

    setTimeout(() => {
      if (!isLevelAlsoSet) {
        this.platform.socket.write(jsonMessage);
        platform.socket.pendingSetRequests.set(
          `${this.type}-${this.id}-Power`,
          jsonMessage
        );

        api.once(`Response-${this.type}-${this.id}-Set-Power`, () => {
          platform.socket.pendingSetRequests.delete(
            `${this.type}-${this.id}-Power`
          );
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
    platform.socket.pendingSetRequests.set(
      `${this.type}-${this.id}-Power`,
      jsonMessage
    );

    api.once(`Response-${this.type}-${this.id}-Set-Power`, () => {
      platform.socket.pendingSetRequests.delete(
        `${this.type}-${this.id}-Power`
      );
      callback();
    });
  }
}

export function getLightLevel(callback: (arg0: any, arg1: number) => void) {
  const { platform } = this;
  const { api } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "Level"
  })}||`;

  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(
    `${this.type}-${this.id}-Level`,
    jsonMessage
  );

  api.once(`Response-${this.type}-${this.id}-Get-Level`, (value: number) => {
    platform.socket.pendingGetRequests.delete(`${this.type}-${this.id}-Level`);
    const percentLevel = (value * 100) / 65535;
    callback(null, percentLevel);
  });
}

export function setLightLevel(percentLevel: number, callback: () => void) {
  const { platform } = this;
  const { api } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Set",
    Property: "Level",
    Value: (percentLevel / 100) * 65535
  })}||`;

  this.platform.socket.write(jsonMessage);
  api.emit(`Request-${this.type}-${this.id}-Set-Level`);
  platform.socket.pendingSetRequests.set(
    `${this.type}-${this.id}-Level`,
    jsonMessage
  );

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
export function getPercentageValue(callback: (arg0: any, arg1: Number) => void) {
  const { platform } = this;
  const { api } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "PerValue"
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(
    `${this.type}-${this.id}-PerValue`,
    jsonMessage
  );

  api.once(`Response-${this.type}-${this.id}-Get-PerValue`, (value: Number) => {
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
export function setPercentageValue(pervalue: Number, callback: () => void) {
  const { platform } = this;
  const { api } = platform;
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
  platform.socket.pendingSetRequests.set(
    `${this.type}-${this.id}-PerValue`,
    jsonMessage
  );

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
export function PositionState(callback: (arg0: any, arg1: Number) => void) {
  const { platform } = this;
  const { api } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "PostionState"
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(
    `${this.type}-${this.id}-PostionState`,
    jsonMessage
  );

  api.once(`Response-${this.type}-${this.id}-Get-PostionState`, (value: Number) => {
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
export function getSensorState(callback: (arg0: any, arg1: Boolean) => void) {
  const { platform } = this;
  const { api } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "SensorState"
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(
    `${this.type}-${this.id}-SensorState`,
    jsonMessage
  );

  api.once(`Response-${this.type}-${this.id}-Get-SensorState`, (value: Boolean) => {
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
export function getValue(callback: (arg0: any, arg1: Number) => void) {
  const { platform } = this;
  const { api } = platform;
  const jsonMessage = `${JSON.stringify({
    DeviceId: this.id,
    DeviceType: this.type,
    MessageType: "Request",
    Operation: "Get",
    Property: "Value"
  })}||`;
  platform.socket.write(jsonMessage);
  platform.socket.pendingGetRequests.set(
    `${this.type}-${this.id}-Value`,
    jsonMessage
  );

  api.once(`Response-${this.type}-${this.id}-Get-Value`, (value: Number) => {
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
export function setValue(value: Number, callback: () => void) {
  const { platform } = this;
  const { api } = platform;
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
  platform.socket.pendingSetRequests.set(
    `${this.type}-${this.id}-Value`,
    jsonMessage
  );

  api.once(`Response-${this.type}-${this.id}-Set-Value`, () => {
    platform.socket.pendingSetRequests.delete(`${this.type}-${this.id}-Value`);
    callback();
  });
}