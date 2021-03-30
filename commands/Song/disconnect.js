module.exports = {
  name: `disconnect`,
  category: `Queue`,
  aliases: [`dc`, "leave", "dis"],
  description: `Disconnects the bot from the voice channel it is in.`,
  usage: `disconnect`,
  run: async (client, message, args, cmduser, text, prefix) => {
      //get the voice channel of the member
      const { channel } = message.member.voice;
      //if he is not connected to a vc return error
      if (!channel)  return message.channel.send(`:x: **You have to be in a voice channel to use this command.**`);
      //get voice channel of the bot
      const botchannel = message.guild.me.voice.channel;
      //get the music player
      const player = client.manager.players.get(message.guild.id);
      //if no player or no botchannel return error
      if(!player || !botchannel) return message.channel.send(`:x: **I am not playing anything.**`);
      //if queue size too small return error
      if(!player.current < 1) return message.channel.send(`:x: **I am not playing anything.**`);
      //if user is not in the right channel as bot, then return error
      if(player && channel.id !== player.voiceChannel)
        return message.channel.send(`**:x: You need to be in the same voice channel as Milrato x Rythm to use this command**`);
      //clear the QUEUE
      player.destroy();
      //Send Success Message
      return message.channel.send(`**:mailbox_with_no_mail: Successfully disconnected**`);
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
