const FCM = require("fcm-node");
const serverKey =
  "AAAAnY5E5pw:APA91bEgkFBTzUOfzeBGTCvJ0m7GZfhvEQzftwX4YwWz4UtEeePB7aRGZd7374kRt4xOj74rAK8ja928HIX2_LEu2vWpUkA_IXIHsTym3PVKeXvQVIQ3vDbwWSrqZDYB_4abgcSLopHX";
const sendNotification = async(data) => {
  console.log("call")
  const fcm = new FCM(serverKey);
  const message = {
    notification: {
      type: data.type,
      body: data.body,
      data:data.data
    },
    // to: "eDu4bOpNTWGrkJqbRY5Z6d:APA91bFNPt-6Y1-QMAekaVpG8DJGG8BiEdvmV-DXwV7UOW3iPeuiElP_3-_UCrGnRpv9z7U6CG5UegF-TNdDYJwJq-45pxKI7q2xo7mgq2WnmGeizzS65Q7bEzlp2abrZQF6NWg1yGlG",
    to:data.deviceToken,
  };

  fcm.send(message, function (err, response) {
    if (err){
      console.log("err=",err);
      return ({status:false,message:err});
    } 
    else{
      console.log("err=",response);
      return (response);
    } 
  });
};

module.exports = sendNotification;
