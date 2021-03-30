const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
module.exports = {
  getMember: function (message, toFind = "") {
    try {
      toFind = toFind.toLowerCase();
      let target = message.guild.members.get(toFind);
      if (!target && message.mentions.members) target = message.mentions.members.first();
      if (!target && toFind) {
        target = message.guild.members.find((member) => {
          return member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind);
        });
      }
      if (!target) target = message.member;
      return target;
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  shuffle: function (a) {
    try {
      var j, x, i;
      for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
      return a;
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  formatDate: function (date) {
    try {
      return new Intl.DateTimeFormat("en-US").format(date);
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  duration: function (ms) {
    const sec = Math.floor((ms / 1000) % 60).toString();
    const min = Math.floor((ms / (60 * 1000)) % 60).toString();
    const hrs = Math.floor((ms / (60 * 60 * 1000)) % 60).toString();
    const days = Math.floor((ms / (24 * 60 * 60 * 1000)) % 60).toString();
    return `${days}Days,${hrs}Hours,${min}Minutes,${sec}Seconds`;
  },
  promptMessage: async function (message, author, time, validReactions) {
    try {
      time *= 1000;
      for (const reaction of validReactions) await message.react(reaction);
      const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
      return message.awaitReactions(filter, {
        max: 1,
        time: time
      }).then((collected) => collected.first() && collected.first().emoji.name);
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  delay: function (delayInms) {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  //randomnumber between 0 and x
  getRandomInt: function (max) {
    try {
      return Math.floor(Math.random() * Math.floor(max));
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  //random number between y and x
  getRandomNum: function (min, max) {
    try {
      return Math.floor(Math.random() * Math.floor((max - min) + min));
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  createBar: function (player) {
    /*  OLD CREATE BAR WAY

    try{
      //player.queue.current.duration == 0 ? player.position : player.queue.current.duration, player.position, 25, "▬", config.settings.progressbar_emoji)
      if (!player.queue.current) return `**[${config.settings.progressbar_emoji}${line.repeat(size - 1)}]**\n**00:00:00 / 00:00:00**`;
      let current = player.queue.current.duration !== 0 ? player.position : player.queue.current.duration;
      let total = player.queue.current.duration;
      let size = 25;
      let line = "▬";
      let slider = config.settings.progressbar_emoji;
      let bar = current > total ? [line.repeat(size / 2 * 2), (current / total) * 100] : [line.repeat(Math.round(size / 2 * (current / total))).replace(/.$/, slider) + line.repeat(size - Math.round(size * (current / total)) + 1), current / total];
      if (!String(bar).includes(config.settings.progressbar_emoji)) return `**[${config.settings.progressbar_emoji}${line.repeat(size - 1)}]**\n**00:00:00 / 00:00:00**`;
      return `**[${bar[0]}]**\n**${new Date(player.position).toISOString().substr(11, 8)+" / "+(player.queue.current.duration==0?" ◉ LIVE":new Date(player.queue.current.duration).toISOString().substr(11, 8))}**`;
    }catch (e){
      console.log(String(e.stack).bgRed)
    }*/

    /* NEW WAY
    try{
      if (!player.queue.current) return `**${emoji.msg.progress_bar.leftindicator}${emoji.msg.progress_bar.filledframe}${emoji.msg.progress_bar.emptyframe.repeat(size - 1)}${emoji.msg.progress_bar.rightindicator}**\n**00:00:00 / 00:00:00**`;
      let current = player.queue.current.duration !== 0 ? player.position : player.queue.current.duration;
      let total = player.queue.current.duration;
      let size = 15;
      let bar = String(emoji.msg.progress_bar.leftindicator) + String(emoji.msg.progress_bar.filledframe).repeat(Math.round(size * (current / total))) + String(emoji.msg.progress_bar.emptyframe).repeat(size - Math.round(size * (current / total))) + String(emoji.msg.progress_bar.rightindicator);
      return `**${bar}**\n**${new Date(player.position).toISOString().substr(11, 8)+" / "+(player.queue.current.duration==0?" ◉ LIVE":new Date(player.queue.current.duration).toISOString().substr(11, 8))}**`;
    }catch (e){
      console.log(String(e.stack).bgRed)
    }

  */
    /* CUSTOM WAY */
    try {
      // EMOJIS.JSON
      // "progress_bar": {
      //  "leftindicator": "<:progressbar_left_filled:818558865268408341>",
      //  "rightindicator": "<:progressbar_right_filled:818558865540907038>",
      //
      //  "emptyframe": "<:progressbar_middle_unfilled:818558865532649503>",
      //  "filledframe": "<:progressbar_middle_filled:818558865595564062>",
      //
      //  "emptybeginning": "<:progressbar_left_filled_hal:818558865628725298>",
      //  "emptyend": "<:progressbar_right_unfilled:818558865619681300>"
      // }

      if (!player.queue.current) return `**${emoji.msg.progress_bar.emptybeginning}${emoji.msg.progress_bar.filledframe}${emoji.msg.progress_bar.emptyframe.repeat(size - 1)}${emoji.msg.progress_bar.emptyend}**\n**00:00:00 / 00:00:00**`;
      let current = player.queue.current.duration !== 0 ? player.position : player.queue.current.duration;
      let total = player.queue.current.duration;
      let size = 15;
      let rightside = size - Math.round(size * (current / total));
      let leftside = Math.round(size * (current / total));
      let bar;
      if (leftside < 1) bar = String(emoji.msg.progress_bar.emptybeginning) + String(emoji.msg.progress_bar.emptyframe).repeat(rightside) + String(emoji.msg.progress_bar.emptyend);
      else bar = String(emoji.msg.progress_bar.leftindicator) + String(emoji.msg.progress_bar.filledframe).repeat(leftside) + String(emoji.msg.progress_bar.emptyframe).repeat(rightside) + String(size - rightside !== 1 ? emoji.msg.progress_bar.emptyend : emoji.msg.progress_bar.rightindicator);
      return `**${bar}**\n**${new Date(player.position).toISOString().substr(11, 8)+" / "+(player.queue.current.duration==0?" ◉ LIVE":new Date(player.queue.current.duration).toISOString().substr(11, 8))}**`;
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }

  },
  format: function (millis) {
    try {
        // Pad to 2 or 3 digits, default is 2
  function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }
      var ms = millis% 1000;
      millis = (millis - ms) / 1000;
      var s = millis % 60;
      millis = (millis - s) / 60;
      var m = millis % 60;
      var h = (millis - m) / 60;
      if (h < 1) return pad(m) + ':' + pad(s);
      return pad(h) + ':' + pad(m) + ':' + pad(s);
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  databasing: function (client, guildid) {
    try {
      if (guildid) {
        client.settings.ensure(guildid, {
          prefix: config.prefix,
          pruning: true,
          djroles: [],
        });
      }
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  escapeRegex: function (str) {
    try {
      return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  arrayMove: function (array, from, to) {
    try {
      array = [...array];
      const startIndex = from < 0 ? array.length + from : from;
      if (startIndex >= 0 && startIndex < array.length) {
        const endIndex = to < 0 ? array.length + to : to;
        const [item] = array.splice(from, 1);
        array.splice(endIndex, 0, item);
      }
      return array;
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  paginationEmbed: async function(msg, pages, emojiList = ['⏪', '⏩', "⏹"], timeout = 120000) {
    if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
    if (!pages) throw new Error('Pages are not given.');
    if (emojiList.length <= 2) throw new Error('Need at least two emojis.');
    let page = 0;
    let actualpages = [];
    let embed = false;
    if(!msg.guild.me.permissionsIn(msg.channel).has("MANAGE_MESSAGES")) msg.channel.send("**:x: Note that I need the Permission, to remove REACTIONS**")
    if(msg.guild.me.permissionsIn(msg.channel).has("EMBED_LINKS")){
      embed = true;
      for(const page of pages) actualpages.push(new MessageEmbed().setDescription(page.msg).setTitle(page.title))
    }else{
      for(const page of pages) actualpages.push(page.msg)
    }
    var curPage;
    if(embed)
    curPage = await msg.channel.send(actualpages[page].setFooter(`Page  |  ${page + 1} / ${actualpages.length}`, msg.client.user.displayAvatarURL()));
    else 
    curPage = await msg.channel.send(String(actualpages[page]).substr(0, 1950) + `**Page  |  ${page + 1} / ${actualpages.length}**`);
    for (const emoji of emojiList) await curPage.react(emoji);
    const reactionCollector = curPage.createReactionCollector(
      (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot && user.id === msg.author.id,
      { time: timeout }
    );
    reactionCollector.on('collect', reaction => {
      reaction.users.remove(msg.author);
      switch (reaction.emoji.name) {
        case emojiList[0]:
          page = page > 0 ? --page : actualpages.length - 1;
          break;
        case emojiList[1]:
          page = page + 1 < actualpages.length ? ++page : 0;
          break;
        default:
          curPage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: '));
          break;
      } 
      if(embed)
      curPage.edit(actualpages[page].setFooter(`Page  |  ${page + 1} / ${actualpages.length}`, msg.client.user.displayAvatarURL()));
      else
      curPage.edit(String(actualpages[page]).substr(0, 1950) + `**Page  |  ${page + 1} / ${actualpages.length}**`);
    });
    reactionCollector.on('end', () => {
      if (!curPage.deleted) {
        curPage.reactions.removeAll()
      }
    });
    return curPage;
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
