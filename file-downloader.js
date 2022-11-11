var Minio = require("minio");
const http = require('https');
const fs = require('fs');

var amqp = require("amqplib/callback_api");

const mClient = new Minio.Client({
  endPoint: "play.min.io",
  port: 9000,
  useSSL: true,
  accessKey: "Q3AM3UQ867SPQQA43P2F",
  secretKey: "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG",
});

const INCOMING_PATH = "./Incoming/example.pdf";
var queue = "minio";




amqp.connect("amqp://localhost", function (error0, conn) {
  if (error0) {
    throw error0;
  }
  console.log("Connected to the local RabbitMQ Server.");

  // Listener
  conn.createChannel((err, ch2) => {
    if (err) throw err;
    console.log("Create RabbitMQ Server Listener");

    ch2.assertQueue(queue, {
      durable: false
    });

    ch2.consume(queue, (msg) => {
      if (msg !== null) {
        // console.log(msg.content.toString());
        console.log("Received the url of file uploaded from RabbitMQ Server.");
        console.log(msg.content.toString());
        ch2.ack(msg);

        http.get(msg.content.toString(), function(response) {
          console.log("Start downloading.");
          const file = fs.createWriteStream(INCOMING_PATH);
          response.pipe(file);

          file.on("finish", () => {
            file.close();
            console.log("Download Completed!");
            file.end();
          })
        });
      } else {
        console.log("Consumer cancelled by server");
      }
    });
  });
});
