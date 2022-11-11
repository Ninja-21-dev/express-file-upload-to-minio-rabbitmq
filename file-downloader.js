var Minio = require("minio");
var amqp = require("amqplib/callback_api");

const mClient = new Minio.Client({
  endPoint: "play.min.io",
  port: 9000,
  useSSL: true,
  accessKey: "Q3AM3UQ867SPQQA43P2F",
  secretKey: "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG",
});

var file = "./Incoming/example.pdf";
var testBucket,
  testObject = "testObject",
  testUrl;

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }

  // Listener
  conn.createChannel((err, ch2) => {
    if (err) throw err;

    ch2.assertQueue(queue);

    ch2.consume(queue, (msg) => {
      if (msg !== null) {
        console.log(msg.content.toString());
        ch2.ack(msg);
        console.log("url");
        console.log(msg);
      } else {
        console.log("Consumer cancelled by server");
      }
    });
  });
});
