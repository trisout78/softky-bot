const { Colors } = require("discord.js");
const fetch = require('request');

module.exports = {
    name: "reset-password",
    description: "Reset ton mot de passe de ton compte Pterodactyl.",
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
        let i = 1;
        list(i);
        function list(number){
            fetch({
                url: `https://dash.softky.eu/api/application/users?page=${number}`,
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer ptla_4K1xABrwBOdrx0PPdSbC46YlkC6P8W0E4ZC4BJTWzsw",
                }
            }, (e, res, body) => {
                const r = JSON.parse(body);
                let id = r.data.find(e => e.attributes.email == `${interaction.user.id}@softky.eu`);
                if(!id){
                    i++;
                    list(i);
                }
                if(id){
                    a(id);
                }
            })
        }
        function a(id){
            fetch({
                "url": `https://dash.softky.eu/api/application/users/${id.attributes.id}`,
                "method": "PATCH",
                "headers": {
                    "Accept": "Application/vnd.pterodactyl.v1+json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer ptla_4K1xABrwBOdrx0PPdSbC46YlkC6P8W0E4ZC4BJTWzsw"
                },
                "body": {
                    "username": interaction.user.id,
                    "email": `${interaction.user.id}@softky.eu`,
                    "password": password,
                    "first_name": interaction.user.username,
                    "last_name": interaction.user.username,
                    "language": "en",
                },
                json: true
            }, (e, res, body) => {
                console.log(e);
                if(e == null && res.statusCode == 200 || res.statusCode == 201){
                    const embed = {
                        title: "Votre mot de passe à bien été modifié",
                        description: `Identifiant: ${interaction.user.id}\nMot de passe: ${password}`,
                        footer: {
                            "text": "Enregistre bien tes informations de connexion !"
                        },
                        color: Colors.Blurple
                    };
                    interaction.reply({embeds: [embed], ephemeral: true});
                } else {
                    interaction.reply({content: "Erreur lors de la réinitialisation du mot de passe.", ephemeral: true});
                    console.error(body)
                }
            })
        }
    },
}