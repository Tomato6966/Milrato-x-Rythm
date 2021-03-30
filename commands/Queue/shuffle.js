module.exports = {
  name: `shuffle`,
  category: `Queue`,
  aliases: [`mix`, "random"],
  description: `Shuffles the Queue`,
  usage: `shuffle`,
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
      //if bot connected bot not with the lavalink player then try to delete the player
      if(player && botchannel && channel.id !== botchannel.id){
        player.destroy();
      }
      player.set(`beforeshuffle`, player.queue.map(track => track));
      //shuffle the Queue
      player.queue.shuffle();
      //return success message
     return message.channel.send(`**:boom: Cleared... :stop_button:**`);

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
