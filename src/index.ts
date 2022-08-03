import request from "request";
import { ILatestData, ILocation, IThermostat } from "./types";
import { TCC_API_URL } from "./utils/constants";
import { setCookiesToMap } from "./utils/cookies";
import { extractLocations, extractThermostats } from "./utils/extract";

class HoneywellTCC {

    private username: string;
    private password: string;

    protected refreshAuth: NodeJS.Timer;
    protected jar: request.CookieJar;
    protected isLoggedIn: boolean;

    constructor() {
        this.isLoggedIn = false;
        this.jar = request.jar();
        this.refreshAuth = setInterval(() => {
            this.login(this.username, this.password).catch((ex) => {
                this.isLoggedIn = false;
                clearInterval(this.refreshAuth);
                throw new Error('Failed to refresh auth');
            });
        }, 1500 * 1000);
    }

    async login(username: string, password: string): Promise<string> {

        return await new Promise((resolve, reject) => {

            const tempJar = request.jar();

            request({
                url: `${TCC_API_URL}/portal/`,
                method: 'POST',
                jar: tempJar,
                json: {
                    'timeOffset': 300,
                    'UserName': username,
                    'Password': password,
                    'RememberMe': true
                },
                followRedirect: false,
                followAllRedirects: false
            }, (e, r, b) => {

                if (e || r.statusCode !== 302)
                    return reject(e || `Login failed [${r.statusCode}]`)

                const setCookies = setCookiesToMap(r.headers["set-cookie"]);

                if (setCookies.get('.ASPXAUTH_TRUEHOME') && setCookies.get('.ASPXAUTH_TRUEHOME_AT')) {
                    this.jar = tempJar;
                    this.username = username
                    this.password = password;
                    this.isLoggedIn = true;
                    return resolve(b);
                } else if (r.headers.location.includes('/portal/Error/TooManyAttempts')) {
                    return reject('Login failed: too many attempts');
                } else {
                    return reject('Login failed: unknown error');
                }

            });
        });

    }

    async getThermostatData(deviceId: number): Promise<ILatestData> {

        if (!this.isLoggedIn) throw new Error('Not logged in');

        return await new Promise((resolve, reject) => {
            request({
                url: `${TCC_API_URL}/portal/Device/CheckDataSession/${deviceId}?_=${Date.now()}`,
                method: 'GET',
                jar: this.jar,
                followAllRedirects: true,
                followRedirect: true,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                json: true
            }, (e, r, b) => {
                if (e || r.statusCode !== 200 || !b.success) reject(e || `Failed to get device data [${r.statusCode}]`);
                else return resolve(b.latestData);
            });
        });

    }

    async getLocations(): Promise<Location[]> {

        if (!this.isLoggedIn) throw new Error('Not logged in');

        return await new Promise((resolve, reject) => {
            request({
                url: `${TCC_API_URL}/portal/Locations`,
                method: 'GET',
                jar: this.jar,
                followAllRedirects: true,
                followRedirect: true,
            }, (e, r, b) => {
                if (e || r.statusCode !== 200 || !b.includes('<h1>My Locations</h1>')) reject(e || `Failed to get locations [${r.statusCode}]`);
                else return resolve(extractLocations(b).map((location) => { return new Location(location, this); }));
            });
        });

    }

    async getThermostats(locationId: number): Promise<Thermostat[]> {

        if (!this.isLoggedIn) throw new Error('Not logged in');

        return await new Promise((resolve, reject) => {
            request({
                url: `${TCC_API_URL}/portal/${locationId}/Zones`,
                method: 'GET',
                jar: this.jar,
                followAllRedirects: true,
                followRedirect: true,
            }, (e, r, b) => {
                if (e || r.statusCode !== 200 || !b.includes('<h1>Thermostat(s) in Home</h1>')) reject(e || `Failed to get thermostats [${r.statusCode}]`);
                else return resolve(extractThermostats(b).map((thermostat) => { return new Thermostat(thermostat, this); }));
            });
        });

    }

}

class Location {

    public id: number;
    public type: string;
    public name: string;
    protected honeywell: HoneywellTCC;

    constructor(location: ILocation, honeywell: HoneywellTCC) {
        this.id = location.id;
        this.type = location.type;
        this.name = location.name;
        this.honeywell = honeywell;
    }

    getThermostats(): Promise<Thermostat[]> {
        return this.honeywell.getThermostats(this.id);
    }

}

class Thermostat {

    public id: number;
    public name: string;
    protected honeywell: HoneywellTCC;

    constructor(thermostat: IThermostat, honeywell: HoneywellTCC) {
        this.id = thermostat.id;
        this.name = thermostat.name;
        this.honeywell = honeywell;
    }

    getData(): Promise<ILatestData> {
        return this.honeywell.getThermostatData(this.id);
    }

}

export default HoneywellTCC;