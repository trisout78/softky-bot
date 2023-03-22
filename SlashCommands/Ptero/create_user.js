const { Colors } = require("discord.js");

module.exports = {
    name: "create-user",
    description: "Create an account",
    folder: 'serveur',
    /**
     *
     * @param {discord.Client} bot
     * @param {discord.CommandInteraction} interaction
     * @param {String[]} args
     */
     type: 1,
     run: async (bot, interaction, args) =>{
        const password = new Array(12).fill().map(() => String.fromCharCode(Math.random()*86+40)).join("");
        await interaction.deferReply();
        
        const userData = {
            username: interaction.user.id,
            email: `${interaction.user.id}@trisout.fr`,
            password: password,
            first_name: interaction.user.username,
            last_name: interaction.user.username,
            root_admin: false,
            language: "en",
        };
        bot.Admin.createUser(userData)
        .then(() => {
            const embed = {
                title: "Your account has been successfully created",
                description: `Panel: http://147.185.221.180:64520\nUsername: ${interaction.user.id}\nPassword: ${password}`,
                color: Colors.Green
            };
            const embed2 = {
                title: "Your account has been successfully created",
                description: `Check your DM to get panel credentials`,
                color: Colors.Green
            };                   
            interaction.editReply({embeds: [embed2]});
            bot.users.cache.get(interaction.user.id).send({
                                embeds: [embed]
                            }).catch(() => { console.log('I cant send it DM') });
        })
        .catch(err => {
            interaction.editReply({content: "You already have an account", ephemeral: true});
            console.error(err)
        });
    },
}