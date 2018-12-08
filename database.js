import {
    initializeApp,
    database
} from 'firebase';
export class MyAppDatabase {
    constructor(fbsConfig, config) {
        initializeApp(fbsConfig);
        this.config = config;
        this.database = database();
        this.chatRef = this.database.ref(this.config.chatPath);
        this.driverRef = this.database.ref(this.config.driverPath);
    }
    addMockData() {
        let avatar = 'https://www.library.caltech.edu/sites/default/files/styles/headshot/public/default_images/user.png'
        let data = [
            { key: 'Faizan', long: 67.064827, lat: 24.999886 },
            { key: 'Ali', long: 78.488330, lat: 17.331500 },
            { key: 'Ahmed', long: 29.905810, lat: 31.198910 },
            { key: 'Raja', long: 66.988060, lat: 24.871940 },
            { key: 'Nabeel', long: 174.797012, lat: -41.244411 },
            { key: 'Asif', long: 67.064827, lat: 24.999886 },
            { key: 'Izyan', long: 66.988060, lat: 24.871940 },
            { key: 'Usman', long: 66.988060, lat: 24.871940 },
            { key: 'Abdul', long: -121.265700, lat: 38.781900 },
            { key: 'kashif', long: 66.988060, lat: 24.871940 }
        ].map(({name, long, lat}) => ({name, avatar, location: {long, lat}})).map(this.createDriver)
    }
    createDriver(driver) {
        let driverObj = this.driverRef.push()
        return driverObj.set({ ...driver, key: driverObj.key })
    }
    getAllDrivers() {
        return this.driverRef.once('value').then(a => Object.values(a.val() || {}))
    }
    registerForChat(driverKey, callback) {
        let ref = this.chatRef.ref(driverKey);
        function call(snap) {
            let values = snap.val();
            callback(Object.keys(values).map(k => ({
                key: k,
                ...values[k]
            })))
        }
        ref.on('value', call)
        return () => ref.off('value', call)
    }
    registerForLocation(driverKey, callback) {
        let ref = this.driverRef.ref(driverKey).ref('location');
        function call(snap) {
            let value = snap.val();
            callback(value)
        }
        ref.on('value', call)
        return () => ref.off('value', call)
    }
    saveDriverLocation(driverKey, location) {
        let ref = this.driverRef.ref(driverKey).ref(location);
        ref.set({
            updated: Date.now(),
            ...location
        })
    }
    chatWithDriver(driverKey, chat) {
        return this.chatRef.ref(driverKey).push({ ...chat, timestamp: Date.now() })
    }
};
export const fbsConfig = {
    apiKey: "AIzaSyAJkRfVjbIyLXWH-MWrm4u8CakZS1ZLTnI",
    authDomain: "locationtrack-5fd9d.firebaseapp.com",
    databaseURL: "https://locationtrack-5fd9d.firebaseio.com",
    projectId: "locationtrack-5fd9d",
    storageBucket: "locationtrack-5fd9d.appspot.com",
    messagingSenderId: "116011094420"
};
export const config = {
    chatPath: 'chat',
    driverPath: 'driver',
};
export default new MyAppDatabase(fbsConfig, config);