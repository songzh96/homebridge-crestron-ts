import { BaseAccessory } from "./BaseAccessory";
import {
    getPowerState, setPowerState, setValue, getValue, setInput
} from "./Callbacks";


export class Television extends BaseAccessory {
    televisionService: any;
    speakerService: any;
    inputs: any;
    constructor(log: Function, accessoryConfig: { id: number; type: string; name: string; manufacturer: string; model: string; serialnumber: string; frmwarerevision: string; }, platform: any) {
        super(log, accessoryConfig, platform);
        this.inputs = accessoryConfig["inputs"];
    }

    getServices() {
        const { platform } = this;
        const { api } = platform;
        const {
            hap: { Characteristic, Service }
        } = api;
        const TelevisionService = new Service.Television();
        const powerState = TelevisionService
            .getCharacteristic(Characteristic.Active)
            .on('get', getPowerState.bind(this))
            .on('set', setPowerState.bind(this));
        TelevisionService.setCharacteristic(Characteristic.ConfiguredName, this.name);
        TelevisionService.setCharacteristic(Characteristic.SleepDiscoveryMode, Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE);
        const remoteKey = TelevisionService
            .getCharacteristic(Characteristic.RemoteKey)
            .on("set", setValue.bind(this, "RemoteKey"));

        this.televisionService = TelevisionService;

        // Configure HomeKit TV Volume Control
        const SpeakerService = new Service.TelevisionSpeaker(this.name + " Volume", "volumeService");
        
        SpeakerService
            .setCharacteristic(Characteristic.Active, Characteristic.Active.ACTIVE)
            .setCharacteristic(Characteristic.VolumeControlType, Characteristic.VolumeControlType.ABSOLUTE);

        const volume = SpeakerService
            .getCharacteristic(Characteristic.Volume)
            .on("get", getValue.bind(this, "Volume"))
            .on("set", setValue.bind(this, "Volume"));

        const mute = SpeakerService
            .getCharacteristic(Characteristic.Mute)
            .on("get", getValue.bind(this, "Mute"))
            .on("set", setValue.bind(this, "Mute"));
        this.speakerService = SpeakerService;
        
        this.televisionService.addLinkedService(this.speakerService);

        const activeIdentifier = TelevisionService
            .getCharacteristic(Characteristic.ActiveIdentifier)
            .on("set", setInput.bind(this, this.inputs));

        var configuredInputs = this.setupInputs();
        configuredInputs.forEach((input) => {
            this.televisionService.addLinkedService(input);
        });

        api.on(`Event-${this.type}-${this.id}-Set-Power`, (value: any) => {
            powerState.updateValue(Boolean(value));
        });

        api.on(`Event-${this.type}-${this.id}-Set-Volume`, (value: any) => {
            volume.updateValue(value);
        });

        api.on(`Event-${this.type}-${this.id}-Set-Mute`, (value: any) => {
            mute.updateValue(value);
        });
        
        this.log("televisionService complete.");
       
        return [this.infoService, TelevisionService];
    }

    setupInputs() {
        var configuredInputs = [];
        var counter = 1;

        this.inputs.forEach((input: { id: any; name: any; type: string; }) => {
            let id = input.id;
            let name = input.name;
            let type = this.determineInputType(input.type);
            this.log("Adding input " + counter + ": Name: " + name + ", Type: " + input.type);

            configuredInputs.push(this.createInputSource(id, name, counter, type));
           
            counter = counter + 1;
        });
        console.log(configuredInputs);
        return configuredInputs;
    }

    createInputSource(id: any, name: any, counter: number, type: any): any {
        var input = new this.platform.api.hap.Service.InputSource(id.toLowerCase().replace(" ", ""), name);
        input
            .setCharacteristic(this.platform.api.hap.Characteristic.Identifier, counter)
            .setCharacteristic(this.platform.api.hap.Characteristic.ConfiguredName, name)
            .setCharacteristic(this.platform.api.hap.Characteristic.InputSourceType, type)
            .setCharacteristic(this.platform.api.hap.Characteristic.IsConfigured, this.platform.api.hap.Characteristic.IsConfigured.CONFIGURED);

        return input;
    }

    determineInputType(type: any) {
        
        switch (type) {
            case "TV":
                return this.platform.api.hap.Characteristic.InputSourceType.TUNER;
            case "HDMI":
                return this.platform.api.hap.Characteristic.InputSourceType.HDMI;
            case "APPLICATION":
                return this.platform.api.hap.Characteristic.InputSourceType.APPLICATION;
            default:
                return this.platform.api.hap.Characteristic.InputSourceType.OTHER;
        }
    }


}
