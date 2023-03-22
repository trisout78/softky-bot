const {Client, CommandInteraction, Colors} = require('discord.js');

module.exports = {
    name: "client",
    description: "Récupérer le rôle client pour vérifier ton compte.",
    type: 1,
    folder: 'utilitaire',
    /**
     *
     * @param {Client} bot
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (bot, interaction, args) =>{
        if(interaction.member.roles.cache.has("1052985334486540378"))return interaction.reply({content: `Vous avez déjà le rôle client.`, ephemeral: true});

        interaction.member.roles.add("1052985334486540378");
        interaction.reply({
            content: `Vous avez maintenant le rôle client.`,
            ephemeral: true
        });
    },
};