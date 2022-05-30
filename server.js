const Tracker = require('./lib/Tracker');

function init() {
    const tracker = new Tracker;
    tracker.mainMenu();
}
console.log(`
=================================
Welcome to Employee Tracker App!
=================================
            `);
init();