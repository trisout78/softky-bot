const { Colors } = require("discord.js");
const fetch = require('request');

module.exports = {
    name: "create_server",
    description: "Créé ton serveur sur Softky.",
    options: [
        {
            name: "offre",
            description: "Précises l'offre que tu veux.",
            choices: [
                {
                    name: "NodeJS",
                    value: "15"
                },
                {
                    name: "Python",
                    value: "16"
                }
            ],
            type: 10,
            required: true
        }
    ],
    folder: 'serveur',
    /**
     *
     * @param {discord.Client} bot
     * @param {discord.CommandInteraction} interaction
     * @param {String[]} args
     */
     type: 1,
     run: async (bot, interaction, args) =>{
        const egg = interaction.options.getNumber("offre");
        const container = {
            startup: {
                15: 'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/node /home/container/{{BOT_JS_FILE}}',
                16: 'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z {{PY_PACKAGES}} ]]; then pip install -U --prefix .local {{PY_PACKAGES}}; fi; if [[ -f /home/container/${REQUIREMENTS_FILE} ]]; then pip install -U --prefix .local -r ${REQUIREMENTS_FILE}; fi; /usr/local/bin/python /home/container/{{PY_FILE}}'
            },
            docker_image: {
                15: "ghcr.io/parkervcp/yolks:nodejs_18",
                16: "ghcr.io/parkervcp/yolks:python_3.10"
            }
        }
        await interaction.deferReply({ephemeral:true});
        let i = 1, l = 1;
        let array = [];
        list(i);
        function listServer(number, id){
            fetch({
                url: `https://dash.softky.eu/api/application/servers?page=${number}`,
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer ptla_4K1xABrwBOdrx0PPdSbC46YlkC6P8W0E4ZC4BJTWzsw",
                }
            }, (e, res, body) => {
                const r = JSON.parse(body);
                r.data.forEach((e) => {
                    if(e.attributes.user == id.attributes.id){
                        array.push(e.attributes.name);
                    }
                })

                    if(array.length >= 4) return interaction.editReply({content: "Vous avez atteint une limite de 4 serveurs."});
                    if(l == r.meta.pagination.total_pages){
                        a(id);
                    }
                    else {
                        l++;
                        listServer(l, id);
                    }
            })
        }
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
                    if(i == r.meta.pagination.total_pages) return interaction.editReply({content: "Vous n'avez pas créé de compte."});
                    i++;
                    list(i);
                }
                if(id){
                    listServer(l, id);
                }
            })
        }
        function a(id){
            fetch({
            "url": "https://dash.softky.eu/api/application/servers",
            "method": "POST",
            "headers": {
                "Accept": "Application/vnd.pterodactyl.v1+json",
                "Content-Type": "application/json",
                "Authorization": "Bearer ptla_4K1xABrwBOdrx0PPdSbC46YlkC6P8W0E4ZC4BJTWzsw"
            },
            "body": {
                "name": `${interaction.user.username} Serveur`,
                "user": id.attributes.id,
                "egg": egg,
                "docker_image": container.docker_image[egg],
                "startup": container.startup[egg],
                "environment": {
                    "BUNGEE_VERSION": "latest",
                    "SERVER_JARFILE": "server.jar",
                    "USER_UPLOAD":"0",
                    "AUTO_UPDATE":"0",
                    "PY_FILE":"app.py",
                    "JS_FILE":"index.js",
                    "BOT_JS_FILE":"index.js",
                    "REQUIREMENTS_FILE":"requirements.txt"
                },
                "limits": {
                "memory": 512,
                "swap": 0,
                "disk": 1024,
                "io": 500,
                "cpu": 50
                },
                "feature_limits": {
                "databases": 0,
                "backups": 2,
                allocations: 2
                },
                deploy: {
                    locations: [1],
                    dedicated_ip: false,
                    port_range: []
                },
            },
            json: true
            }, (e, res, body) => {
                if(e == null && res.statusCode == 200 || res.statusCode == 201){
                    const embed = {
                        title: "Votre serveur a bien été créé",
                        description: 'Découvre le sur ton compte Softky.',
                        color: Colors.Blurple
                    };
                    interaction.editReply({embeds: [embed], ephemeral: true});
                } else {
                    interaction.editReply({content: "Erreur lors de la création de votre serveur.", ephemeral: true});
                    console.log(body.errors);
                }
            })
        }
    },
}