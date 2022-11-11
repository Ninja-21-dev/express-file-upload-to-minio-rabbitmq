var Minio = require("minio");

var mClient = new Minio.Client({
    endPoint: 'play.min.io',
    port: 9000,
    useSSL: true,
    accessKey: 'Q3AM3UQ867SPQQA43P2F',
    secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG' 
});


var file = './Outgoing/example.pdf'

// mClient.makeBucket('testbucke2', 'us-east-1', function(err) {
//     if (err) return console.log(err)

//     console.log('Bucket created successfully in "us-east-1"')

//     var metaData = {
//         'Content-Type': 'application/ootet-stream',
//         'X-Amz-Meta-Testing': 1234,
//         'example': 5678
//     }

//    mClient.fPutObject('testbucket2', 'testobject1', file, metaData, function(err, etag) {
//     if (err) return console.log(err);
//     console.log('File uploaded successfully.: ' + etag);
//    })
// })

var testBucket, testObject = "testObject";
const listBucketsPromise = mClient.listBuckets();
const getBucketName = mClient.listBuckets(function(e, buckets) {
    if (e) return console.log(e)
    testBucket =  buckets[0];
    // testBucket = buckets[0]
    // console.log('buckets :')
    // console.log(testBucket)


    // console.log(testUrl);
  var metaData = {
    'Content-Type': 'application/ootet-stream',
    'X-Amz-Meta-Testing': 123,
    'example': 456
  };

    mClient.fPutObject(testBucket.name, testObject, file, metaData, function(err,etag) {
        if (err) return console.log(err);
        console.log('File uploaded successfully.:');

        var testUrl;
        mClient.presignedGetObject(testBucket.name, testObject, 1000, function(e, presignedUrl) {
                    if (e) return console.log(e);
                    testUrl = presignedUrl;
                    console.log(testUrl);
                  });
    });
  });
//   testBucket = getBucketName;
//   console.log('testBucket :');
//   console.log(testBucket);
  



//   var testUrl = mClient.presignedGetObject('testbucke2', 'testobject1', 1000, function(e, presignedUrl) {
//         if (e) return console.log(e);
//         return presignedUrl;

//       });

//       console.log(testUrl);
// mClient.getObjectLegalHold('testbucke2', 'testobject1', {}, function(err, res) {
//     if (err) {
//       return console.log('Unable to get legal hold config for the object', err.message);
//     }
//     console.log('Get Legalhold config');
//     console.log(res);
//   });

//   var presignedUrl = mClient.presignedGetObject('testbucke2', 'testobject1', 1000, function(e, presignedUrl) {
//     if (e) return console.log(e);
//     console.log('Get url');
//     console.log(presignedUrl);
//   });