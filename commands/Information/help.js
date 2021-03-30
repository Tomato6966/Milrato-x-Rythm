const { MessageEmbed, Message } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "help",
    category: "Information",
    aliases: ["h", "halp"],
    cooldown: 4,
    usage: "help",
    description: "Shows you Help for Milrato x Rythm",
    run: async (client, message, args, user, text, prefix) => {
      try{
        let string = `:white_check_mark: Type \`${prefix}commands\` for a list of Commands\n\n:question: New to **Milrato x Rythm**? Check out our [Rythm's FAQ](https://rythm.fm/docs/faq/)\n\n:page_facing_up: Still need help? [Click here](https://discord.gg/wvCp7q88G3) to join our [Discord server](https://discord.gg/wvCp7q88G3)`
        let embed = new MessageEmbed()
        .setTitle("Milrato x Rythm Help")
        .setURL("https://milrato.eu")
        .setDescription(string)
        if(message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS")){
          message.reply(embed)
        }else{
          message.reply(string)
        }
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
