var amqp = require("amqplib/callback_api");
var amqpConn = null;


amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'hello';
    var msg = 'Hello world';

    channel.assertQueue(queue, {
      durable: false
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
    }, 500);
});


// function start() {
//   amqp.connect("amqp://localhost", function (err, conn) {
//     if (err) {
//       console.error("[AMQP]", err.message);
//       return setTimeout(start, 1000);
//     }

//     conn.on("error", function (err) {
//       if (err.message !== "Connection closing") {
//         console.error("[AMQP] conn error", err.message);
//       }
//     });

//     conn.on("close", function () {
//       console.error("[AMQP] reconnecting");
//       return setTimeout(start, 1000);
//     });

//     amqpConn = conn;
//     whenConnected();
//   });
// }

// function whenConnected() {
//   startPublisher();
//   startWorker();
// }

// var pubChannel = null;
// var offlinePubQueue = [];
// function startPublisher() {
//   amqpConn.createConfirmChannel(function (err, ch) {
//     if (closeOnerr(err)) return;

//     ch.on("error", function (err) {
//       console.err("[AMQP] channel error", err.message);
//     });

//     ch.on("close", function () {
//       console.log("[AMQP] channel closed");
//     });

//     pubChannel = ch;
//     while (true) {
//       var [exchange, routingKey, content] = offlinePubQueue.shift();
//       publish(exchange, routingKey, content);
//     }
//   });
// }

// function publish(exchange, routingKey, content) {
//   try {
//     pubChannel.publish(
//       exchange,
//       routingKey,
//       content,
//       { persistent: true },
//       function (err, ok) {
//         if (err) {
//           console.error("[AMQP] publish", err);
//           offlinePubQueue.push([exchange, routingKey, content]);
//           pubChannel.connection.close();
//         }
//       }
//     );
//   } catch (e) {
//     console.error("[AMQP] publish", e.message);
//     offlinePubQueue.push([exchange, routingKey, content]);
//   }
// }

// // A worker that acks messages only if processed successfully
// function startWorker() {
//   amqpConn.createChannel(function (err, ch) {
//     if (closeOnErr(err)) return;
//     ch.on("error", function (err) {
//       console.error("[AMQP] channel error", err.message);
//     });
//     ch.on("close", function () {
//       console.log("[AMQP] channel closed");
//     });

//     ch.prefetch(10);
//     ch.assertQueue("minio", { durable: true }, function (err, _ok) {
//       if (closeOnErr(err)) return;
//       ch.consume("minio", processMsg, { noAck: false });
//       console.log("Worker is started");
//     });
//   });
// }

// function processMsg(msg) {
//   work(msg, function (ok) {
//     try {
//       if (ok) ch.ack(msg);
//       else ch.reject(msg, true);
//     } catch (ejobs) {
//       closeOnErr(e);
//     }
//   });
// }

// function work(msg, cb) {
//   console.log("PDF processing of ", msg.content.toString());
//   cb(true);
// }

// function closeOnErr(err) {
//   if (!err) return false;
//   console.error("[AMQP] error", err);
//   amqpConn.close();
//   return true;
// }

// start();
// // module.exports = start();