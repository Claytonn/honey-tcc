# Honey-TCC 🍯
Honeywell Total Connect Comfort Interface

## Installation

`npm install honey-tcc`

## Usage

```js

import HoneyTCC from 'honey-tcc';

const tcc = new HoneyTCC();

await tcc.login(email, password);

const locations = await tcc.getLocations();

for(location of locations) {

    const thermostats = await location.getThermostats();
  
    for(thermostat of thermostats) {
    
        const { uiData, fanData } = await thermostat.getData();

        console.log(`Thermostat: ${thermostat.id} - ${thermostat.name}`);
        console.log('Indoor Humidity:', uiData.IndoorHumidity);
        console.log('Indoor Temperature:', uiData.DispTemperature);
        console.log('Outdoor Humidity:', uiData.OutdoorHumidity);
        console.log('Outdoor Temperature:', uiData.OutdoorTemperature);

    }
        
}


```
