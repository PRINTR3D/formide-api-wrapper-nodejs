'use strict';

// modules
const Formide = require('../../lib');
const blessed = require('blessed')
const blessed_contrib = require('blessed-contrib')
const screen = blessed.screen();
const extruderLines = blessed_contrib.line({
    style: {
        line: "yellow",
        text: "green",
        baseline: "black"
    },
    xLabelPadding: 3,
    xPadding: 5,
    showLegend: true,
    wholeNumbersOnly: false,
    label: 'Temperature'
});
screen.append(extruderLines);

var extruderGraphs = []

// Load .env file
require('dotenv').config({
    path: 'examples/terminal-graph/.env'
});

// Initialize new Formide API instance with websocket token
const formide = new Formide.client({
    webSocketToken: process.env.FORMIDE_SOCKET_TOKEN
});

var formideWebSocket = null;

// we wrap this in a try-catch to prevent a crash when connecting without access token
try { formideWebSocket = formide.socket.getSocket(); }
catch (e) { console.error(e); }

formideWebSocket.on('printer.status', function (data) {
    for (var i = 0; i < data.extruders.length; i++) {
        if (!extruderGraphs[i])
            extruderGraphs[i] = { title: `Ext. ${i}`, x: [], y: [] };

        extruderGraphs[i].x.push(new Date().toLocaleTimeString());
        extruderGraphs[i].y.push(data.extruders[i].temp);
    }

    extruderLines.setData(extruderGraphs);
    screen.render();
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});