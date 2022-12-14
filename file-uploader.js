var Minio = require("minio");
var amqp = require("amqplib/callback_api");
// var AMQP = require("./rabbit");

const mClient = new Minio.Client({
  endPoint: "play.min.io",
  port: 9000,
  useSSL: true,
  accessKey: "Q3AM3UQ867SPQQA43P2F",
  secretKey: "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG",
});

var file = "./Outgoing/example.pdf";
var testBucket,
  testObject = "testObject",
  testUrl;
var queue = "minio";

mClient.listBuckets(function (e, buckets) {
  if (e) return console.log(e);
  testBucket = buckets[0];

  console.log("The first item of bucket list is found.");
  console.log(testBucket);

  var metaData = {
    "Content-Type": "application/ootet-stream",
    "X-Amz-Meta-Testing": 123,
    example: 456,
  };

  mClient.fPutObject(
    testBucket.name,
    testObject,
    file,
    metaData,
    function (err, etag) {
      if (err) return console.log(err);

      console.log("Upload the file successfully.");

      mClient.presignedGetObject(
        testBucket.name,
        testObject,
        1000,
        function (e, presignedUrl) {
          if (e) return console.log(e);
          testUrl = presignedUrl;

          console.log("Got the Url:");
          console.log(testUrl);

          amqp.connect("amqp://localhost", function (error0, connection) {
            if (error0) {
              throw error0;
            }
        
            console.log("Connected to the local RabbitMQ Server.");
        
            connection.createChannel(function (error1, channel) {
              if (error1) {
                throw error1;
              }
              
              console.log("Create the channel to send a message into queue.");
              

              const msg = testUrl;

              channel.assertQueue(queue, {
                durable: false,
              });

              channel.sendToQueue(queue, Buffer.from(msg));
              console.log(" [x] Sent %s", msg);
            });

            // setTimeout(function() {
              // connection.close();
              // process.exit(0)
              // }, 500);
          });
        }
      );
    }
  );
});
