const {
    MessageEmbed, Message, splitMessage
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const {
    KSoftClient
} = require(`@ksoft/api`);
const ee = require(`../../botconfig/embed.json`);
const {
    format,
    delay
} = require(`../../handlers/functions`);
module.exports = {
    name: `lyrics`,
    category: `Song`,
    aliases: [`l`, `ly`],
    description: `Shows The Lyrics of the current track`,
    usage: `lyrics [Songtitle]`,
    cooldown: 15,
    run: async (client, message, args, cmduser, text, prefix) => {
            //get the voice channel of the member
            const { channel } = message.member.voice;
            //if he is not connected to a vc return error
            if (!args[0] && !channel)  return message.channel.send(`:x: **You have to be in a voice channel to use this command.**`);
            //send error if member is Deafed
            if(!args[0] && message.member.voice.selfDeaf) return message.channel.send(`:x: **You cannot run this command while deafened**`);
            //get voice channel of the bot
            const botchannel = message.guild.me.voice.channel;
            //get the music player
            const player = client.manager.players.get(message.guild.id);
            //if no player or no botchannel return error
            if(!args[0] && (!player || !botchannel)) return message.channel.send(`**:x: Nothing playing in this server**`);
            //if queue size too small return error
            if (!args[0] && (!player.queue || !player.queue.current)) return message.channel.send(`**:x: Nothing playing in this server**`);
            //if user is not in the right channel as bot, then return error
            if(!args[0] && (player && channel.id !== player.voiceChannel))
                return message.channel.send(`**:x: You need to be in the same voice channel as Milrato x Rythm to use this command**`);
            //if bot connected bot not with the lavalink player then try to delete the player
            if(!args[0] && (player && botchannel && channel.id !== botchannel.id)){
                player.destroy();
            }
            //get the Song Title
            let title = args[0] || player.queue.current.title || "404";
            if(title == "404") return message.channel.send(`**:x: Something went wrong**`);
            //if there are search terms, search for the lyrics
            if (args[0]) {
                //get the new title
                title = args.join(` `);
            }
            //set the lyrics temp. to null
            let lyrics = null;
            //send info msg
            let lyricsmsg = await message.channel.send(`**:mag: Searching lyrics for \`${title}\`**`).catch(e=>console.log("error"))
            //if there is the use of lyrics_finder
            //create a new Ksoft Client
            const ksoft = new KSoftClient(config.ksoftapi);
            //get the lyrics
            await ksoft.lyrics.get(title).then(async (track) => {
                //send error if no lyrics
                if (!track.lyrics) return lyricsmsg.edit(`**:x: No Lyrics found for:** \`${title}\``).catch(e=>console.log("error"))
                //safe the lyrics on the temp. variable
                lyrics = track.lyrics;
            });
            var embeds = [];

            let lyembed = new MessageEmbed().setColor("#00ff00").setTitle(title.substr(0, 256)).setDescription(lyrics);

            const splitDescription = splitMessage(lyembed.description);
            for(var i = 0; i < splitDescription.length; i++){
                if(i > 0){
                    embeds.push(new MessageEmbed().setColor("#00ff00").setDescription(splitDescription[i]))
                }else{
                    embeds.push(lyembed.setDescription(splitDescription[i]));
                }
            }


            lyricsmsg.edit({content: `**:mag: Searching lyrics for \`${title}\`**`, embed: embeds[0]}).catch(e=>console.log("error"))
            for(let i = 1; i<embeds.length;i++){
                message.channel.send(embeds[i]).catch(e=>console.log("error"))
            }
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
