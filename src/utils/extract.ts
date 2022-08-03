import { load } from 'cheerio';
import { ILocation, IThermostat } from '../types/honeywell';

export function extractLocations(html: string): ILocation[] {

    const $ = load(html);
    const locations: ILocation[] = [];

    $('#location-list tr:not(.separator)').each((i, el) => {
        const $el = $(el);
        locations.push({
            id: Number($el.attr('data-id')),
            type: $el.find('td.location-type > img').attr('alt'),
            name: $el.find('.location-name').text().trim()
        });
    });

    return locations;

}

export function extractThermostats(html: string): IThermostat[] {

    const $ = load(html);
    const thermostats: IThermostat[] = [];

    $('#zone-list tr:not(.separator)').each((i, el) => {
        const $el = $(el);
        thermostats.push({
            id: Number($el.attr('data-id')),
            name: $el.find('.location-name').text().trim(),
        });
    });

    return thermostats;

}