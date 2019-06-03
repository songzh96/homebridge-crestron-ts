import { BaseAccessory } from "./BaseAccessory";
import {
    getPowerState, setPowerState, setValue, getValue
} from "./Callbacks";


export class Television extends BaseAccessory {
    televisionService: any;
    speakerService: any;
    inputs: any;
    constructor(log: Function, accessoryConfig: { id: number; type: string; name: string; manufacturer: string; model: string; serialnumber: string; frmwarerevision: string; }, platform: any) {
        super(log, accessoryConfig, platform);
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
        const activeIdentifier = TelevisionService
            .setCharacteristic(Characteristic.ActiveIdentifier,0)
            
        this.televisionService = TelevisionService;

        // Configure HomeKit TV Volume Control
        const SpeakerService = new Service.TelevisionSpeaker();
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

        api.on(`Event-${this.type}-${this.id}-Set-Power`, (value: any) => {
            powerState.updateValue(Boolean(value));
        });

        api.on(`Event-${this.type}-${this.id}-Set-Volume`, (value: any) => {
            volume.updateValue(value);
        });

        api.on(`Event-${this.type}-${this.id}-Set-Mute`, (value: any) => {
            mute.updateValue(value);
        });


        return [this.infoService, TelevisionService];
    }


}
