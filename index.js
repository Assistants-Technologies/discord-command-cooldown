const fs = require('fs');
const path = require('path');

async function saveUser(userID, commandName, timeEnd){
    const data = fs.readFileSync(path.resolve(__dirname,'activeTimeouts.json'));
    let activeTimeouts = JSON.parse(data);
    activeTimeouts[commandName] ? null : activeTimeouts[commandName] = {};
    activeTimeouts[commandName][userID] = {userID, timeEnd};

    fs.writeFileSync(path.resolve(__dirname,'activeTimeouts.json'), JSON.stringify(activeTimeouts, null, 3));
}

async function checkForUser(userID, commandName) {
    const data = fs.readFileSync(path.resolve(__dirname,'activeTimeouts.json'));
    let activeTimeouts = JSON.parse(data);

    if(!activeTimeouts[commandName])return false;
    if(!activeTimeouts[commandName][userID])return false;

    const dateNow = Date.now();
    const now = new Date(dateNow);

    let userData = activeTimeouts[commandName][userID];

    if(now > new Date(userData.timeEnd)){
        delete activeTimeouts[commandName][userID];
        fs.writeFileSync(path.resolve(__dirname,'activeTimeouts.json'), JSON.stringify(activeTimeouts, null, 3));
        return false;
    }

    let nowDate = now;
    let endDate = new Date(userData.timeEnd);
    userData.msLeft = Math.abs(nowDate.getTime() - endDate.getTime()).toString();
    return userData;
}

class CommandCooldown {
    constructor(commandName, timeout) {
        this.commandName = commandName;
        this.timeout = timeout;
        const data = fs.readFileSync(path.resolve(__dirname,'activeTimeouts.json'));
        const activeTimeouts = JSON.parse(data);
        this.activeTimeouts = activeTimeouts;
        if(!activeTimeouts[commandName])activeTimeouts[commandName]={};
        for (let v of Object.values(activeTimeouts[commandName])){
            checkForUser(v.userID, this.commandName);
        }
    }

    async addUser(userID) {
        let endDate = Date.now();
        endDate += this.timeout;
        let timeEnd = new Date(endDate);

        await saveUser(userID, this.commandName, timeEnd);
    }

    async getUser(userID) {
        return checkForUser(userID, this.commandName);
    }
}

function msToTime(duration, includeZeros) {
    let milliseconds = Math.floor((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    if(includeZeros) {
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
    }

    return { hours, minutes, seconds};
}

module.exports = {
    CommandCooldown,
    msToMinutes: (ms, includeZeros=true) => {
        ms = Number(ms);
        const {hours, minutes, seconds} = msToTime(ms, includeZeros);

        return {hours,  minutes, seconds };
    }
};
