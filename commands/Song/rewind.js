const {
  MessageEmbed
} = require(`discord.js`)
const config = require(`../../botconfig/config.json`)
const ee = require(`../../botconfig/embed.json`);
const {
  createBar,
  format
} = require(`../../handlers/functions`);
module.exports = {
  name: `rewind`,
  category: `Song`,
  aliases: [`rwd`],
  description: `Rewinds by a certain amount of time in the current track.`,
  usage: `rewind <time>`,
  run: async (client, message, args, cmduser, text, prefix) => {
      //get the voice channel of the member
      const { channel } = message.member.voice;
      //if he is not connected to a vc return error
      if (!channel)  return message.channel.send(`:x: **You have to be in a voice channel to use this command.**`);
      //send error if member is Deafed
      if(message.member.voice.selfDeaf) return message.channel.send(`:x: **You cannot run this command while deafened**`);
      //get voice channel of the bot
      const botchannel = message.guild.me.voice.channel;
      //get the music player
      const player = client.manager.players.get(message.guild.id);
      //if no player or no botchannel return error
      if(!player || !botchannel) return message.channel.send(`**:x: Nothing playing in this server**`);
      //if queue size too small return error
      if (!player.queue || !player.queue.current) return message.channel.send(`**:x: Nothing playing in this server**`);
      //if user is not in the right channel as bot, then return error
      if(player && channel.id !== player.voiceChannel)
        return message.channel.send(`**:x: You need to be in the same voice channel as Milrato x Rythm to use this command**`);
      //if invalid usage
      if (!args[0]) {
        let string = `${prefix}rewind <Time in seconds>`
        let embed = new MessageEmbed()
        .setTitle("**:x: Invalid usage**")
        .setDescription(string)
        if(message.guild.me.hasPermission("EMBED_LINKS")){
          message.channel.send(embed)
        }else{
          message.channel.send("**:x: Invalid usage**\n"+string)
        }
        return;
      }
      //get the seektime variable of the user input
      let seektime = player.position - Number(args[0]) * 1000;
      //if userinput is wrong correct it 
      if (seektime >= player.queue.current.duration - player.position || seektime < 0) 
      return message.channel.send("**:x: Cannot rewind that far back in the song**")
      //seek to the right time
      player.seek(Number(seektime));
      //Send Success Message
      return message.channel.send(`**:musical_note: Set position to \`${format(player.position)}\` :fast_forward:**`);
  }
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
