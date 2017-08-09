/* eslint unicorn/filename-case: "off", func-names: "off", camelcase: "off", no-unused-vars: "off" */

/* TODO
 this.addOptionalCharacteristic(Characteristic.StatusActive);
 this.addOptionalCharacteristic(Characteristic.StatusFault);
 this.addOptionalCharacteristic(Characteristic.StatusTampered);
 this.addOptionalCharacteristic(Characteristic.StatusLowBattery);
 */

module.exports = function (iface) {
    const {mqttPub, mqttSub, mqttStatus, log, newAccessory, Service, Characteristic} = iface;

    return function createAccessory_HumiditySensor(settings) {
        const sensor = newAccessory(settings);

        mqttSub(settings.topic.statusHumidity, val => {
            log.debug('> hap update', settings.name, 'CurrentRelativeHumidity', mqttStatus[settings.topic.statusHumidity]);
            sensor.getService(Service.HumiditySensor)
                .updateCharacteristic(Characteristic.CurrentRelativeHumidity, val);
        });

        sensor.addService(Service.HumiditySensor)
            .getCharacteristic(Characteristic.CurrentRelativeHumidity)
            .on('get', callback => {
                log.debug('< hap get', settings.name, 'HumiditySensor', 'CurrentRelativeHumidity');
                log.debug('> hap re_get', settings.name, mqttStatus[settings.topic.statusHumidity]);
                callback(null, mqttStatus[settings.topic.statusHumidity]);
            });

        return sensor;
    };
};
