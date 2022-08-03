export interface IDeviceData {
    success: boolean;
    deviceLive: boolean;
    communicationLost: boolean;
    latestData: ILatestData;
    alerts: string;
}

export interface ILatestData {
    uiData: IUIData;
    fanData: IFanData;
    hasFan: boolean;
    canControlHumidification: boolean;
    drData: IDRData;
}

export interface IDRData {
    CoolSetpLimit: null;
    HeatSetpLimit: null;
    Phase: number;
    OptOutable: boolean;
    DeltaCoolSP: null;
    DeltaHeatSP: null;
    Load: null;
}

export const enum FanModes {
    AUTO,
    ON,
    CIRCULATE,
    FOLLOW_SCHEDULE,
    UNKNOWN
}

export const enum SystemSwitch {
    EMERGENCY_HEAT,
    HEAT,
    OFF,
    COOL,
    AUTO_HEAT,
    AUTO_COOL,
    SOUTHERN_AWAY,
    UNKNOWN
}

export const enum SetpointStatus {
    SCHEDULED,
    TEMPORARY,
    HOLD,
    VACATION_HOLD
}

export interface IDeviceControl {
    CoolNextPeriod: number | null;
    CoolSetpoint: number | null;
    DeviceID: number;
    FanMode: FanModes | null;
    HeatNextPeriod: number | null;
    HeatSetpoint: number | null;
    StatusCool: SetpointStatus | null;
    StatusHeat: SetpointStatus | null;
    SystemSwitch: SystemSwitch | null
}

export interface IFanData {
    fanMode: FanModes;
    fanModeAutoAllowed: boolean;
    fanModeOnAllowed: boolean;
    fanModeCirculateAllowed: boolean;
    fanModeFollowScheduleAllowed: boolean;
    fanIsRunning: boolean;
}

export interface IUIData {
    DispTemperature: number;
    HeatSetpoint: number;
    CoolSetpoint: number;
    DisplayUnits: string;
    StatusHeat: number;
    StatusCool: number;
    HoldUntilCapable: boolean;
    ScheduleCapable: boolean;
    VacationHold: number;
    DualSetpointStatus: boolean;
    HeatNextPeriod: number;
    CoolNextPeriod: number;
    HeatLowerSetptLimit: number;
    HeatUpperSetptLimit: number;
    CoolLowerSetptLimit: number;
    CoolUpperSetptLimit: number;
    ScheduleHeatSp: number;
    ScheduleCoolSp: number;
    SwitchAutoAllowed: boolean;
    SwitchCoolAllowed: boolean;
    SwitchOffAllowed: boolean;
    SwitchHeatAllowed: boolean;
    SwitchEmergencyHeatAllowed: boolean;
    SystemSwitchPosition: number;
    Deadband: number;
    IndoorHumidity: number;
    DeviceID: number;
    Commercial: boolean;
    DispTemperatureAvailable: boolean;
    IndoorHumiditySensorAvailable: boolean;
    IndoorHumiditySensorNotFault: boolean;
    VacationHoldUntilTime: number;
    TemporaryHoldUntilTime: number;
    IsInVacationHoldMode: boolean;
    VacationHoldCancelable: boolean;
    SetpointChangeAllowed: boolean;
    OutdoorTemperature: number;
    OutdoorHumidity: number;
    OutdoorHumidityAvailable: boolean;
    OutdoorTemperatureAvailable: boolean;
    DispTemperatureStatus: number;
    IndoorHumidStatus: number;
    OutdoorTempStatus: number;
    OutdoorHumidStatus: number;
    OutdoorTemperatureSensorNotFault: boolean;
    OutdoorHumiditySensorNotFault: boolean;
    CurrentSetpointStatus: number;
    EquipmentOutputStatus: number;
}

export interface ILocation {
    id: number;
    type: string;
    name: string;
}

export interface IThermostat {
    id: number;
    name: string;
}