/* eslint-disable */
import terminal from './terminal'
var appIsOnline = false

terminal.addDeviceReadyEvent(() => {
    appIsOnline = navigator.connection.type !== Connection.NONE

    document.addEventListener("online", () => {
        var networkState = navigator.connection.type
        if (networkState !== Connection.NONE) {
            appIsOnline = true
        }
    }, false)

    document.addEventListener("offline", () => {
        var networkState = navigator.connection.type
        if (networkState === Connection.NONE) {
            appIsOnline = false
        }
    }, false)
})

var net = {
    getConnectionType() {
        var networkState = navigator.connection.type
        var states = {}

        states[Connection.UNKNOWN/*unknown*/]  = 'Unknown connection'
        states[Connection.ETHERNET/*ethernet*/] = 'Ethernet connection'
        states[Connection.WIFI/*wifi*/]     = 'WiFi connection'
        states[Connection.CELL_2G/*2g*/]  = 'Cell 2G connection'
        states[Connection.CELL_3G/*3g*/]  = 'Cell 3G connection'
        states[Connection.CELL_4G/*4g*/]  = 'Cell 4G connection'
        states[Connection.CELL/*cellular*/]     = 'Cell generic connection'
        states[Connection.NONE/*none*/]     = 'No network connection'

        return states[networkState]
    },

    isNetConnected() {
        return appIsOnline
    }
}

export default net
