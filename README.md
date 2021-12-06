# DISCORD-COMMAND-COOLDOWN

NPM: https://www.npmjs.com/package/discord-command-cooldown
<br>
GitHub: https://github.com/breftejk/discord-command-cooldown
<br>
Discord Support Server: https://discord.gg/CzfMGtrdaA

<hr>

A module that allows you to detect if a command should have a cooldown imposed on it and not run for the user. We are above others thanks to the fact that even after restart cooldown is still taken into account according to timeout that was set from the beginning. For example, you set the cooldown for the user to 30 minutes, the bot will be off for 10 minutes, then if you turn it on again, the module will know that there are 20 minutes left!

# Installation

```js
npm i discord-command-cooldown
```

# Usage

```js
const {CommandCooldown, msToMinutes} = require('discord-command-cooldown');

const earnCashCommandCooldown = new CommandCooldown('earnCash', 60000); // Allow users to execute this command each 60 seconds

...
if(command == `${prefix}earn`){
    const userCooldowned = await earnCashCommandCooldown.getUser(message.author.id); // Check if user need to be cooldowned
    if(userCooldowned){
        const timeLeft = msToMinutes(userCooldowned.msLeft);
        return message.reply(`You need to wait ${timeLeft.minutes + ' minutes and ' + timeLeft.seconds + ' seconds'} before running command again!`);
    }
    
    // your command stuff

    await earnCashCommandCooldown.addUser(message.author.id); // Cooldown user again
}
...
```
