const { Colors } = require("discord.js");

module.exports = {
    name: "create_user",
    description: "Créé ton compte sur Softky.",
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

        const userData = {
            username: interaction.user.id,
            email: `${interaction.user.id}@softky.eu`,
            password: password,
            first_name: interaction.user.username,
            last_name: interaction.user.username,
            root_admin: false,
            language: "en",
        };
        bot.Admin.createUser(userData)
        .then(() => {
            const embed = {
                title: "Votre compte à bien été créé",
                description: `Identifiant: ${interaction.user.id}\nMot de passe: ${password}`,
                footer: {
                    "text": "Ceci sont vos identifiants pour vous connecter à l’adresse suivante : space.softky.eu"
                },
                color: Colors.Blurple
            };
            interaction.reply({embeds: [embed], ephemeral: true});
        })
        .catch(err => {
            interaction.reply({content: "Erreur lors de la création du compte.", ephemeral: true});
            console.error(err)
        });
    },
}