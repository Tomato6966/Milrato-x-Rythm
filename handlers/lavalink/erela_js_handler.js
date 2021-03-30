const {
    Manager
} = require("erela.js");
const Spotify = require("erela.js-spotify");
const Deezer = require("erela.js-deezer");
const config = require("../../botconfig/config.json");
const clientID = config.spotify.clientID;
const clientSecret = config.spotify.clientSecret;
module.exports = (client) => {


    if (!clientID || !clientSecret) {
        client.manager = new Manager({
            nodes: config.clientsettings.nodes,
            plugins: [
                new Deezer()
            ],
            send(id, payload) {
                const guild = client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            },
        });
    } else {
        client.manager = new Manager({
            nodes: config.clientsettings.nodes,
            plugins: [
                new Spotify({
                    clientID, //get a clientid from there: https://developer.spotify.com/dashboard
                    clientSecret
                }),
                new Deezer()
            ],
            send(id, payload) {
                const guild = client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            },
        });
    }

    require("./erela_js_node_log")(client)

    client.manager
        .on("playerCreate", async (player) => {
            player.setVolume(50);
            client.channels.cache.get(player.textChannel).send(`:thumbsup: **Joined \`${client.channels.cache.get(player.voiceChannel).name}\` and bound to:** <#${client.channels.cache.get(player.textChannel).id}>`).catch(e => console.log("this prevents a crash"))
        })
        .on("playerMove", async (player, oldChannel, newChannel) => {
            if (!newChannel) {
                /*let channel = await client.channels.fetch(player.voiceChannel)
                client.channels.cache
                    .get(player.textChannel)
                    .send(`:x: Queue ended!\n:thumbsup: Left: **${channel.name}**`);*/
                player.destroy();
                client.channels.cache.get(player.textChannel).messages.fetch(player.get("playermessage")).then(msg => {
                    msg.delete({
                        timeout: 500
                    }).catch(e => console.log("Couldn't delete message this is a catch to prevent a crash".grey));
                });
                player.destroy();
            } else {
                player.voiceChannel = newChannel;
                if (player.paused) return;
                setTimeout(() => {
                    player.pause(true);
                    setTimeout(() => player.pause(false), client.ws.ping * 2);
                }, client.ws.ping * 2);
            }
        })
        .on("trackStart", async (player, track) => {
            //votes for skip --> 0
            player.set("votes", "0");
            //set the vote of every user to FALSE so if they voteskip it will vote skip and not remove voteskip if they have voted before bruh
            for (const userid of client.guilds.cache.get(player.guild).members.cache.map(member => member.user.id))
                player.set(`vote-${userid}`, false);
            //set the previous track just have idk where its used ^-^
            player.set("previoustrack", track);
            //increasing the stats of the BOT
            //if pruning is enabled --> send the msg
            if (client.settings.get(player.guild, `pruning`))
                client.channels.cache.get(player.textChannel).send(`**Playing** :notes: \`${track.title}\` - Now!`).then(msg => {
                    //try to delete the old playingsongmsg informational track if not available / get able --> catch and dont crash
                    try {
                        if (player.get(`playingsongmsg`) && msg.id !== player.get(`playingsongmsg`).id)
                            player.get(`playingsongmsg`).delete().catch(e => console.log("couldn't delete message this is a catch to prevent a crash".grey));
                    } catch {
                        /* */
                    }
                    //set the old message information to a variable
                    player.set(`playingsongmsg`, msg)
                })
        })
        .on("trackStuck", async (player, track, payload) => {

            player.stop();
            client.channels.cache
                .get(player.textChannel)
                .send(`:x: **\`${track.title}\`** got Stuck\n:thumbsup: Skipping it!`);

        })
        .on("trackError", async (player, track, payload) => {

            player.stop();
            client.channels.cache
                .get(player.textChannel)
                .send(`:x: **\`${track.title}\`** Errorred\n:thumbsup: Skipping it!`);


        })
        .on("queueEnd", async (player) => {

            /*let channel = await client.channels.fetch(player.voiceChannel)
            client.channels.cache
                .get(player.textChannel)
                .send(`:x: Queue ended!\n:thumbsup: Left: **${channel.name}**`);*/
            player.destroy();

        });
    client.once("ready", () => client.manager.init(client.user.id));
    client.on("raw", (d) => client.manager.updateVoiceState(d));
    client.on("channelDelete", channel => {

        if (channel.type === "voice") {
            if (channel.members.has(client.user.id)) {
                var player = client.manager.players.get(channel.guild.id);
                if (!player) return;
                if (channel.id === player.voiceChannel) player.destroy();
            }
        }

    })
    client.on("guildRemove", guild => {

        var player = client.manager.players.get(guild.id);
        if (!player) return;
        if (guild.id == player.guild) player.destroy();

    })


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