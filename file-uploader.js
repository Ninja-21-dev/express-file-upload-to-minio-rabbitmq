var Minio = require("minio");
require("./rabbit");

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

mClient.listBuckets(function (e, buckets) {
  if (e) return console.log(e);
  testBucket = buckets[0];

  console.log("Usefull bucket is found.");

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

      console.log("File uploaded successfully.");

      mClient.presignedGetObject(
        testBucket.name,
        testObject,
        1000,
        function (e, presignedUrl) {
          if (e) return console.log(e);
          testUrl = presignedUrl;

          console.log("Url:");
          console.log(testUrl);

          startPublisher(testUrl);
        }
      );
    }
  );
});
