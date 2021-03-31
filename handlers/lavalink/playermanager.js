const Discord = require("discord.js")
const {
MessageEmbed
} = require("discord.js")
const config = require("../../botconfig/config.json")
const ee = require("../../botconfig/embed.json")
const {
format,
delay,
isrequestchannel,
edit_request_message_queue_info,
arrayMove
} = require("../../handlers/functions")
module.exports = async (client, message, args, type, channel, guild) => {
  let method = type.includes(":") ? type.split(":") : Array(type)
  if (!message.guild && !guild) return;

  

  if (method[0] === "play")
    play(client, message, args, type);
  else if (method[0] === "search")
    search(client, message, args, type);
  else if (method[0] === "playtop")
    playtop(client, message, args, type);
  else if (method[0] === "playskip")
    playskip(client, message, args, type);
  else
    return message.channel.send(new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setFooter(ee.footertext, ee.footericon)
      .setTitle("❌ Error | No valid search Term? ... Please Contact: `Tomato#6966`")
    );
}
//function for searching songs
async function search(client, message, args, type) {
const search = args.join(" ");
  let res;
  // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
  res = await client.manager.search({
    query: search,
    source: type.split(":")[1]
  }, message.author);
  // Check the load type as this command is not that advanced for basics
  if (res.loadType === "LOAD_FAILED") throw res.exception;

  var max = 10;
  var collected;
  if (res.tracks.length < max) max = res.tracks.length;
  track = res.tracks[0]

  var results = "";
  if(message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS")){
    results = res.tracks.slice(0, max).map((track, index) => `\`${++index}.\` [${String(track.title).split("[").join("\[").split("]").join("\]")}](${track.uri}) **[${format(track.duration).split(" | ")[0]}]**`).join('\n\n');
    results += "\n\n\n**Type a number to make a choice. Type \`cancel\` to exit**";
    results = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}), "https://milrato.eu")
    .setColor(ee.color)
    .setDescription(results)
  }else {
    results = res.tracks.slice(0, max).map((track, index) => `\`${++index}.\` \`${String(track.title).split("[").join("\[").split("]").join("\]")}\` **[${format(track.duration).split(" | ")[0]}]**`).join('\n\n');
    results += "\n\n\n**Type a number to make a choice. Type \`cancel\` to exit**";
  }
  
  let searchmsg = await message.channel.send(results)

  waitforanswer()
  function waitforanswer(){
    message.channel.awaitMessages(m => m.author.id == message.author.id, {
      max: 1,
      time: 30000,
      errors: ['time']
    }).then(collected => {
      searchmsg.delete().catch(e=>console.log("could not delete msg"))
  
      const first = collected.first().content;
      if (first.toLowerCase() === 'cancel') {
        message.channel.send("✅")
        if (player && player.queue && !player.queue.current) player.destroy().catch(e=>console.log("e"));
        return;
      }
      const index = Number(first) - 1;
      if (index < 0 || index > max - 1) return waitforanswer();
  
        track = res.tracks[index];
        if (!res.tracks[0])
          return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(String("❌ Error | Found nothing for: **`" + search).substr(0, 256 - 3) + "`**")
            .setDescription(`Please retry!`)
          );
        // Create the player
        let player = client.manager.create({
          guild: message.guild.id,
          voiceChannel: message.member.voice.channel.id,
          textChannel: message.channel.id,
          selfDeafen: false,
        });
        if (player.state !== "CONNECTED") {
          // Connect to the voice channel and add the track to the queue
          player.connect();
          player.set("message", message);
          player.set("playerauthor", message.author.id);
          player.queue.add(track);
          player.play();
        } else {
        //add track
        player.queue.add(track);
        var time = 0;
        //create info msg embed
        let playembed = new Discord.MessageEmbed()
          .setAuthor(`Added to queue`, message.author.displayAvatarURL({dynamic: true}), "https://milrato.eu")
          .setURL(track.uri)
          .setTitle("**" + track.title + "**").setColor(ee.color)
          .setThumbnail(`https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`)
          .addField("Channel", track.author, true)
          .addField("Song Duration: ", track.isStream ? "LIVE STREAM" : format(track.duration).split(" | ")[0], true)
          //timing for estimated time creation
          if(player.queue.size > 0) player.queue.map((track) => time += track.duration)
          time += player.queue.current.duration - player.position;
          time -= track.duration;
          playembed.addField("Estimated time until playing", format(time).split(" | ")[0], true)
          
          playembed.addField("Position in queue", `${player.queue.length}`, true)
        //if bot allowed to send embed, do it otherwise pure txt msg
        if(message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS"))
          return message.channel.send(playembed);
        else
          return message.channel.send(`Added: \`${track.title}\` - to the Queue\n**Channel:** ${track.author}\n**Song Duration:** ${track.isStream ? "LIVE STREAM" : format(track.duration).split(" | ")[0]}\n**Estimated time until playing:** ${time}\n**Position in queue:** ${player.queue.length}\n${track.uri}`);
        }
      }).catch(e=>{
        searchmsg.edit({content: "**:x: Timeout!**", embed: null}) 
      })
  }
}
//function for playling song
async function play(client, message, args, type) {
  const search = args.join(" ");
    let res;
        res = await client.manager.search({
          query: search,
          source: type.split(":")[1]
        }, message.author);
      // Check the load type as this command is not that advanced for basics
      if (res.loadType === "LOAD_FAILED") throw res.exception;
      else if (res.loadType === "PLAYLIST_LOADED") {
        playlist_()
      } else {
        song_()
      }
    //function for calling the song
    function song_() {
      //if no tracks found return info msg
      if (!res.tracks[0]){
        return message.channel.send(`**:x: Found nothing for: \`${search}\`**`);
      }
      //if track is too long return info msg
      if(res.tracks[0].duration > 3 * 60 * 60 * 1000){
        return message.channel.send(`**:x: Cannot play a song that's longer than 3 hours**`)
      }
      //create a player if not created
      let player;
      player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: false,
      });
      //if the player is not connected, then connect and create things
      if (player.state !== "CONNECTED") {
        //connect to the channel
        player.connect()
        //add track
        player.queue.add(res.tracks[0]);
        //play track
        player.play();
      }
      //otherwise
      else {
          //add track
          player.queue.add(res.tracks[0]);
          var time = 0;
          //create info msg embed
          let playembed = new Discord.MessageEmbed()
            .setAuthor(`Added to queue`, message.author.displayAvatarURL({dynamic: true}), "https://milrato.eu")
            .setURL(res.tracks[0].uri)
            .setTitle("**" + res.tracks[0].title + "**").setColor(ee.color)
            .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].identifier}/mqdefault.jpg`)
            .addField("Channel", res.tracks[0].author, true)
            .addField("Song Duration: ", res.tracks[0].isStream ? "LIVE STREAM" : format(res.tracks[0].duration).split(" | ")[0], true)
            //timing for estimated time creation
            if(player.queue.size > 0) player.queue.map((track) => time += track.duration)
            time += player.queue.current.duration - player.position;
            time -= res.tracks[0].duration;
            playembed.addField("Estimated time until playing", format(time).split(" | ")[0], true)
            
            playembed.addField("Position in queue", `${player.queue.length}`, true)
          //if bot allowed to send embed, do it otherwise pure txt msg
          if(message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS"))
            return message.channel.send(playembed);
          else
            return message.channel.send(`Added: \`${res.tracks[0].title}\` - to the Queue\n**Channel:** ${res.tracks[0].author}\n**Song Duration:** ${res.tracks[0].isStream ? "LIVE STREAM" : format(res.tracks[0].duration).split(" | ")[0]}\n**Estimated time until playing:** ${time}\n**Position in queue:** ${player.queue.length}\n${res.tracks[0].uri}`);
      }
    }
    //function for playist
    function playlist_() {
      if (!res.tracks[0]){
        return message.channel.send(`**:x: Found nothing for: \`${search}\`**`);
      }
      for(const track of res.tracks)
        if(track.duration > 3 * 60 * 60 * 1000){
          return message.channel.send(`**:x: Cannot play a song that's longer than 3 hours --> playlist skipped!**`)
        }
      let player;
      player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: false,
      });
      // Connect to the voice channel and add the track to the queue
      if (player.state !== "CONNECTED") {
        player.connect();
        player.queue.add(res.tracks);
        player.play();
      }else{
        player.queue.add(res.tracks);
      }
      var time = 0;
        let playlistembed = new Discord.MessageEmbed()

          .setAuthor(`Playlist added to Queue`, message.author.displayAvatarURL({dynamic:true}), "https://milrato.eu" )
          .setColor(ee.color)
          .setTitle("**"+res.playlist.name+"**")
          .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].identifier}/mqdefault.jpg`)
            //timing for estimated time creation
            if(player.queue.size > 0) player.queue.map((track) => time += track.duration)
            time += player.queue.current.duration - player.position;
            for(const track of res.tracks)
              time -= track.duration;
    
            playlistembed.addField("Estimated time until playing", time > 10 ? format(time).split(" | ")[0] : "NOW")
            .addField("Position in queue", `${player.queue.length - res.tracks.length + 1 === 0 ? "NOW" : player.queue.length - res.tracks.length + 1}`, true)
            .addField("Enqueued", `\`${res.tracks.length}\``, true)
          //if bot allowed to send embed, do it otherwise pure txt msg
          if(message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS"))
            message.channel.send(playlistembed);
          else
            message.channel.send(`Added: \`${res.tracks[0].title}\` - to the Queue\n**Channel:** ${res.tracks[0].author}\n**Song Duration:** ${res.tracks[0].isStream ? "LIVE STREAM" : format(res.tracks[0].duration).split(" | ")[0]}\n**Estimated time until playing:** ${time}\n**Position in queue:** ${player.queue.length}\n${res.tracks[0].uri}`);
    }
}
//function for playling song + skipping
async function playskip(client, message, args, type) {
  const search = args.join(" ");
  let res;
      res = await client.manager.search({
        query: search,
        source: type.split(":")[1]
      }, message.author);
    // Check the load type as this command is not that advanced for basics
    if (res.loadType === "LOAD_FAILED") throw res.exception;
    else if (res.loadType === "PLAYLIST_LOADED") {
      playlist_()
    } else {
      song_()
    }
  function song_() {
    //if no tracks found return info msg
    if (!res.tracks[0]){
      return message.channel.send(`**:x: Found nothing for: \`${search}\`**`);
    }
    //if track is too long return info msg
    if(res.tracks[0].duration > 3 * 60 * 60 * 1000){
      return message.channel.send(`**:x: Cannot play a song that's longer than 3 hours**`)
    }
    //create a player if not created
    let player;
    player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: false,
    });
    //if the player is not connected, then connect and create things
    if (player.state !== "CONNECTED") {
      //connect to the channel
      player.connect()
      //add track
      player.queue.add(res.tracks[0]);
      //play track
      player.play();
    }
    //otherwise
    else {
     //save old tracks on an var
      let oldQueue =[]
      for(const track of player.queue)
        oldQueue.push(track);
      //clear queue
      player.queue.clear();
      //add new tracks
      player.queue.add(res.tracks[0]);
      //now add every old song again
      for (const track of oldQueue)
        player.queue.add(track);
      //skip the current track
      player.stop();
    }
  }
  //function ffor playist
  function playlist_() {
    if (!res.tracks[0]){
      return message.channel.send(`**:x: Found nothing for: \`${search}\`**`);
    }
    for(const track of res.tracks)
      if(track.duration > 3 * 60 * 60 * 1000){
        return message.channel.send(`**:x: Cannot play a song that's longer than 3 hours --> playlist skipped!**`)
      }
    let player;
    player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: false,
    });
    // Connect to the voice channel and add the track to the queue
    if (player.state !== "CONNECTED") {
      player.connect();
      player.queue.add(res.tracks);
      player.play();
    }else{
      //save old tracks on an var
      let oldQueue =[]
      for(const track of player.queue)
        oldQueue.push(track);
      //clear queue
      player.queue.clear();
      //add new tracks
      player.queue.add(res.tracks);
      //now add every old song again
      for (const track of oldQueue)
        player.queue.add(track);
      //skip the current track
      player.stop();
    }
    var time = 0;
      let playlistembed = new Discord.MessageEmbed()

        .setAuthor(`Playlist added to Queue`, message.author.displayAvatarURL({dynamic:true}), "https://milrato.eu" )
        .setColor(ee.color)
        .setTitle("**"+res.playlist.name+"**")
        .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].identifier}/mqdefault.jpg`)
          //timing for estimated time creation
          if(player.queue.size > 0) player.queue.map((track) => time += track.duration)
          time += player.queue.current.duration - player.position;
          for(const track of res.tracks)
            time -= track.duration;
  
          playlistembed.addField("Estimated time until playing", time > 10 ? format(time).split(" | ")[0] : "NOW")
          .addField("Position in queue", `${player.queue.length - res.tracks.length + 1 === 0 ? "NOW" : player.queue.length - res.tracks.length + 1}`, true)
          .addField("Enqueued", `\`${res.tracks.length}\``, true)
        //if bot allowed to send embed, do it otherwise pure txt msg
        if(message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS"))
          message.channel.send(playlistembed);
        else
          message.channel.send(`Added: \`${res.tracks[0].title}\` - to the Queue\n**Channel:** ${res.tracks[0].author}\n**Song Duration:** ${res.tracks[0].isStream ? "LIVE STREAM" : format(res.tracks[0].duration).split(" | ")[0]}\n**Estimated time until playing:** ${time}\n**Position in queue:** ${player.queue.length}\n${res.tracks[0].uri}`);
  }
}
//function for playling song + skipping
async function playtop(client, message, args, type) {
  const search = args.join(" ");
  let res;
      res = await client.manager.search({
        query: search,
        source: type.split(":")[1]
      }, message.author);
    // Check the load type as this command is not that advanced for basics
    if (res.loadType === "LOAD_FAILED") throw res.exception;
    else if (res.loadType === "PLAYLIST_LOADED") {
      playlist_()
    } else {
      song_()
    }
  function song_() {
    //if no tracks found return info msg
    if (!res.tracks[0]){
      return message.channel.send(`**:x: Found nothing for: \`${search}\`**`);
    }
    //if track is too long return info msg
    if(res.tracks[0].duration > 3 * 60 * 60 * 1000){
      return message.channel.send(`**:x: Cannot play a song that's longer than 3 hours**`)
    }
    //create a player if not created
    let player;
    player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: false,
    });
    //if the player is not connected, then connect and create things
    if (player.state !== "CONNECTED") {
      //connect to the channel
      player.connect()
      //add track
      player.queue.add(res.tracks[0]);
      //play track
      player.play();
    }
    //otherwise
    else {
     //save old tracks on an var
      let oldQueue =[]
      for(const track of player.queue)
        oldQueue.push(track);
      //clear queue
      player.queue.clear();
      //add new tracks
      player.queue.add(res.tracks[0]);
      //now add every old song again
      for (const track of oldQueue)
        player.queue.add(track);
      let playembed = new Discord.MessageEmbed()
      .setAuthor(`Added to queue`, message.author.displayAvatarURL({dynamic: true}), "https://milrato.eu")
      .setURL(res.tracks[0].uri)
      .setTitle("**" + res.tracks[0].title + "**").setColor(ee.color)
      .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].identifier}/mqdefault.jpg`)
      .addField("Channel", res.tracks[0].author, true)
      .addField("Song Duration: ", res.tracks[0].isStream ? "LIVE STREAM" : format(res.tracks[0].duration).split(" | ")[0], true)
      //timing for estimated time creation
      if(player.queue.size > 0) player.queue.map((track) => time += track.duration)
      time += player.queue.current.duration - player.position;
      time -= res.tracks[0].duration;
      playembed.addField("Estimated time until playing", format(time).split(" | ")[0], true)
      
      playembed.addField("Position in queue", `${player.queue.length}`, true)
    //if bot allowed to send embed, do it otherwise pure txt msg
    if(message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS"))
      return message.channel.send(playembed);
    else
      return message.channel.send(`Added: \`${res.tracks[0].title}\` - to the Queue\n**Channel:** ${res.tracks[0].author}\n**Song Duration:** ${res.tracks[0].isStream ? "LIVE STREAM" : format(res.tracks[0].duration).split(" | ")[0]}\n**Estimated time until playing:** ${time}\n**Position in queue:** ${player.queue.length}\n${res.tracks[0].uri}`);
  }
  }
  //function ffor playist
  function playlist_() {
    if (!res.tracks[0]){
      return message.channel.send(`**:x: Found nothing for: \`${search}\`**`);
    }
    for(const track of res.tracks)
      if(track.duration > 3 * 60 * 60 * 1000){
        return message.channel.send(`**:x: Cannot play a song that's longer than 3 hours --> playlist skipped!**`)
      }
    let player;
    player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: false,
    });
    // Connect to the voice channel and add the track to the queue
    if (player.state !== "CONNECTED") {
      player.connect();
      player.queue.add(res.tracks);
      player.play();
    }else{
      //save old tracks on an var
      let oldQueue =[]
      for(const track of player.queue)
        oldQueue.push(track);
      //clear queue
      player.queue.clear();
      //add new tracks
      player.queue.add(res.tracks);
      //now add every old song again
      for (const track of oldQueue)
        player.queue.add(track);
    }
    var time = 0;
      let playlistembed = new Discord.MessageEmbed()

        .setAuthor(`Playlist added to Queue`, message.author.displayAvatarURL({dynamic:true}), "https://milrato.eu" )
        .setColor(ee.color)
        .setTitle("**"+res.playlist.name+"**")
        .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].identifier}/mqdefault.jpg`)
          //timing for estimated time creation
          if(player.queue.size > 0) player.queue.map((track) => time += track.duration)
          time += player.queue.current.duration - player.position;
          for(const track of res.tracks)
            time -= track.duration;
  
          playlistembed.addField("Estimated time until playing", time > 10 ? format(time).split(" | ")[0] : "NOW")
          .addField("Position in queue", `${player.queue.length - res.tracks.length + 1 === 0 ? "NOW" : player.queue.length - res.tracks.length + 1}`, true)
          .addField("Enqueued", `\`${res.tracks.length}\``, true)
        //if bot allowed to send embed, do it otherwise pure txt msg
        if(message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS"))
          message.channel.send(playlistembed);
        else
          message.channel.send(`Added: \`${res.tracks[0].title}\` - to the Queue\n**Channel:** ${res.tracks[0].author}\n**Song Duration:** ${res.tracks[0].isStream ? "LIVE STREAM" : format(res.tracks[0].duration).split(" | ")[0]}\n**Estimated time until playing:** ${time}\n**Position in queue:** ${player.queue.length}\n${res.tracks[0].uri}`);
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
