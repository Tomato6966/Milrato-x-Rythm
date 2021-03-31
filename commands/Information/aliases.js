const { MessageEmbed, Message } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { paginationEmbed } = require("../../handlers/functions");
module.exports = {
    name: "aliases",
    category: "Information",
    aliases: ["alias", "ali"],
    cooldown: 4,
    usage: "aliases",
    description: "Shows all available Aliaes for all Commands",
    run: async (client, message, args, user, text, prefix) => {
      try{
       
        //SONG CMD
let string1 = `\`\`\`fix
!disconnect -- dc, leave, dis
!forward    -- fwd
!grab       -- save, yoink
!loop       -- repeat
!lyrics     -- l, ly
!nowplaying -- np
!pause      -- stop
!play       -- p
!playskip   -- ps, pskip, playnow, pn
!playtop    -- ptop, pt
!replay     -- Resets the progress of the current song
!resume     -- continue, re, res
!rewind     -- rwd
!search     -- find
!seek       -- 
!skip       -- next, s
!soundcloud -- sc
\`\`\``
//QUEUE CMD
let string2 = `\`\`\`fix
!clear      -- clearqueue, clearqu, clearq, cl
!loopqueue  -- loopqu, loopq, qloop, lq, queueloop
!shuffle    -- random, mix
\`\`\``
//Information CMD 
let string3 = `\`\`\`fix
!commands   -- cmds, cmd
!aliases    -- alias, ali
!help       -- h, halp
!ping       -- latency
!uptime     -- 
\`\`\``     
        let pages = [
          {"title": "SONG COMMANDS - ALIASES", "msg": string1},
          {"title": "QUEUE COMMANDS - ALIASES", "msg": string2},
          {"title": "INFORMATION COMMANDS - ALIASES", "msg": string3},
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
