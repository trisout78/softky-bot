const { Colors } = require("discord.js");
const fetch = require('request');

module.exports = {
    name: "create-server",
    description: "Create a server",
    options: [
        {
            name: "offer",
            description: "Choose the offer you want.",
            choices: [
                {
                    name: "NodeJS",
                    value: "18"
                },
                {
                    name: "Python",
                    value: "19"
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
        const egg = interaction.options.getNumber("offer");
        const container = {
            startup: {
                18: 'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/node /home/container/{{BOT_JS_FILE}}',
                19: 'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z {{PY_PACKAGES}} ]]; then pip install -U --prefix .local {{PY_PACKAGES}}; fi; if [[ -f /home/container/${REQUIREMENTS_FILE} ]]; then pip install -U --prefix .local -r ${REQUIREMENTS_FILE}; fi; /usr/local/bin/python /home/container/{{PY_FILE}}'
            },
            docker_image: {
                18: "ghcr.io/parkervcp/yolks:nodejs_18",
                19: "ghcr.io/parkervcp/yolks:python_3.10"
            }
        }
        await interaction.deferReply();
        let i = 1, l = 1;
        let array = [];
        list(i);
        function listServer(number, id){
            fetch({
                url: `http://147.185.221.180:64520/api/application/servers?page=${number}`,
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer ptla_zhKtuDU8WOS6vXo9NCw0NdOaUGNDHHcfOSdCkJKs5Jj",
                }
            }, (e, res, body) => {
                const r = JSON.parse(body);
                r.data.forEach((e) => {
                    if(e.attributes.user == id.attributes.id){
                        array.push(e.attributes.name);
                    }
                })

                    if(array.length >= 1) return interaction.editReply({content: "You have exceeded your allowed server limit."});
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
                url: `http://147.185.221.180:64520/api/application/users?page=${number}`,
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer ptla_zhKtuDU8WOS6vXo9NCw0NdOaUGNDHHcfOSdCkJKs5Jj",
                }
            }, (e, res, body) => {
                const r = JSON.parse(body);
                let id = r.data.find(e => e.attributes.email == `${interaction.user.id}@trisout.fr`);
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
            "url": "http://147.185.221.180:64520/api/application/servers",
            "method": "POST",
            "headers": {
                "Accept": "Application/vnd.pterodactyl.v1+json",
                "Content-Type": "application/json",
                "Authorization": "Bearer ptla_zhKtuDU8WOS6vXo9NCw0NdOaUGNDHHcfOSdCkJKs5Jj"
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
                        title: "Your Server Has Been Created",
                        description: 'Go to the panel to manage it',
                        color: Colors.Green
                    };
                    interaction.editReply({embeds: [embed]});
                } else {
                    interaction.editReply({content: "An error has occurred"});
                    console.log(body.errors);
                }
            })
        }
    },
}