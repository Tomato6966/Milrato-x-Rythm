const { MessageEmbed, Message } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { paginationEmbed } = require("../../handlers/functions");
module.exports = {
    name: "commands",
    category: "Information",
    aliases: ["cmd", "cmds"],
    cooldown: 4,
    usage: "commands",
    description: "Shows all available Commands",
    run: async (client, message, args, user, text, prefix) => {
      try{
       
        //SONG CMD
let string1 = `\`\`\`fix
!disconnect -- Disconnects the bot from the voice channel
!forward    -- Forwards by a certain amount of time
!grab       -- Saves the current playing song to your DMs
!loop       -- Toggles looping for the current playing song
!lyrics     -- Shows The Lyrics of the current track
!nowplaying -- Shows what song Rythm is currently playing
!pause      -- Pauses the current playing track
!play       -- Play a song from YouTube with the given name/url
!playskip   -- Skips the current song and plays the song
!playtop    -- Adds a song with the given query on top of queue
!replay     -- Resets the progress of the current song
!resume     -- Resumes paused music
!rewind     -- Rewinds by a certain amount of time
!search     -- Searches from Youtube for a song via your query
!seek       -- Seeks to a certain point in the current track
!skip       -- Votes to skip the current playing song
!soundcloud -- Play a song from SounCloud with the given name/url
\`\`\``
//QUEUE CMD
let string2 = `\`\`\`fix
!clear      -- Clears the whole queue
!loopqueue  -- Toggles looping for the whole queue.
!shuffle    -- Shuffles the Queue
\`\`\``
//Information CMD 
let string3 = `\`\`\`fix
!commands   -- Shows all available Commands
!aliases    -- Shows the Aliases for each Command
!help       -- Shows you Help for Milrato x Rythm
!ping       -- Gives you info on how fast the Bot responds
!uptime     -- Shows the time on how long the Bot is online
\`\`\``     
        let pages = [
          {"title": "SONG COMMANDS", "msg": string1},
          {"title": "QUEUE COMMANDS", "msg": string2},
          {"title": "INFORMATION COMMANDS", "msg": string3},
        ]
        paginationEmbed(message, pages, ['⏪', '⏩', "⏹"], 60000)

    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
        );
    }
  }
}
/**
  * @INFO
  * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention Him / Milrato Development, when using this Code!
  * @INFO
*/
