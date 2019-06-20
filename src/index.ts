import net from 'net';
import { Fan } from './accessories/Fan';
import { Switch } from './accessories/Switch';
import { LightDimmer } from './accessories/LightDimmer';
import { LightSwitch } from './accessories/LightSwitch';
import { WindowCovering } from './accessories/WindowCovering';
import { HeaterCooler } from './accessories/HeaterCooler';
import { OccupancySensor } from './accessories/sensors/OccupancySensor';
import { MotionSensor } from './accessories/sensors/MotionSensor';
import { LeakSensor } from './accessories/sensors/LeakSensor';
import { ContactSensor } from './accessories/sensors/ContactSensor';
import { CarbonMonoxideSensor } from './accessories/sensors/CarbonMonoxideSensor';
import { CarbonDioxideSensor } from './accessories/sensors/CarbonDioxideSensor';
import { SmokeSensor } from './accessories/sensors/SmokeSensor';
import { groupBy, each } from "lodash";
import { Television } from 'homebridge-crestron-ts/src/accessories/Television';
import { AirPurifier } from 'homebridge-crestron-ts/src/accessories/AirPurifier';

const version = "2.0.0";

export default function (homebridge: { registerPlatform: (arg0: string, arg1: string, arg2: typeof Platform) => void; }) {
  homebridge.registerPlatform('homebridge-crestron', 'CrestronS', Platform);
}

class Platform {
  log: Function;
  config: any;
  api: any;
  socket: net.Socket;
  constructor(log: Function, config: any, api: any) {
    this.log = log;
    this.config = config;
    this.api = api; // store the api in the Platform instance
    const { host, port } = this.config;

    this.socket = new net.Socket();
    this.socket.pendingGetRequests = new Map(); // stores outgoing get messages
    this.socket.pendingSetRequests = new Map(); // stores outgoing set messages

    this.socket.on('error', console.error); // logs socket error messages

    //handle socket close
    this.socket.on('close', () => {
      this.log('Connection Lost. Attempting to reconnect in 10 seconds...');
      this.socket.setTimeout(10000, () => {
        this.socket.connect(
          port,
          host,
          () => {
            this.log('Connection re-established with the Crestron Processor');
          }
        );
      });
    });

    // connect to the Crestron processor
    this.socket.connect(
      port,
      host,
      () => {
        this.log(`Connected to the Crestron Processor @ ${host}`);
      }
    );

    // Retry pending `Get` and `Set` Requests every 2 seconds
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

      const jsonMessages = data
        .toString()
        .split('||')
        .filter(jsonMessage => jsonMessage.length > 0);
      jsonMessages.forEach(async jsonMessage => {
        // jsonMessage = jsonMessage.replace("\u0000","");
        try {
          var message = JSON.parse(jsonMessage);
        } catch (error) {

          throw (error);
        }

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
        if (
          messageType === 'Event' &&
          this.socket.pendingSetRequests.has(
            `${deviceType}-${deviceId}-${property}`
          )
        ) {
          this.api.emit(
            `Response-${deviceType}-${deviceId}-${operation}-${property}`
          );

          return;
        }

        this.api.emit(
          `${messageType}-${deviceType}-${deviceId}-${operation}-${property}`,
          value
        );
      });
    });

    // handle program termination
    process.on('exit', () => {
      this.socket.end();
      this.log('Disconnected from the Crestron Processor');
    });

    // handle Homebridge launch
    this.api.on(
      'didFinishLaunching',
      function () {
        this.log('DidFinishLaunching');
        // some information
        this.log.info("                                                              ");
        this.log.info("**************************************************************");
        this.log.info("           CrestronPlatform v-" + version + " By songzh96");
        this.log.info("  GitHub: https://github.com/songzh96/homebridge-crestron-ts  ");
        this.log.info("                                         QQ Group: 107927710  ");
        this.log.info("**************************************************************");
        this.log.info("                                                              ");
      }.bind(this)
    );
  }

  accessories(callback: (arg0: any[]) => void) {
    const accessories = [];
    const { devices } = this.config;
    const devicesByType = groupBy(devices, 'type');

    /*
      Here we register the devices with Homebridge. We group the devices listed
      in the config file by type and we call the appropriate accessory constructor.
     */


    each(devicesByType, (devices: { forEach: (arg0: (device: any) => void) => void; }, type: any) => {
      devices.forEach(device => {
        switch (type) {
          case 'LightSwitch':
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
            accessories.push(new WindowCovering(this.log, device, this));
            return;

          case 'HeaterCooler':
            accessories.push(new HeaterCooler(this.log, device, this));
            return;

          case 'AirPurifier':
            accessories.push(new AirPurifier(this.log, device, this));
            return;

          case 'Television':
            accessories.push(new Television(this.log, device, this));
            return;

          case 'OccupancySensor':
            accessories.push(new OccupancySensor(this.log, device, this));
            return;

          case 'SmokeSensor':
            accessories.push(new SmokeSensor(this.log, device, this));
            return;

          case 'LeakSensor':
            accessories.push(new LeakSensor(this.log, device, this));
            return;

          case 'MotionSensor':
            accessories.push(new MotionSensor(this.log, device, this));
            return;

          case 'ContactSensor':
            accessories.push(new ContactSensor(this.log, device, this));
            return;

          case 'CarbonMonoxideSensor':
            accessories.push(new CarbonMonoxideSensor(this.log, device, this));
            return;

          case 'CarbonDioxideSensor':
            accessories.push(new CarbonDioxideSensor(this.log, device, this));
            return;
        }
      });
    });
    callback(accessories);
  }
}
