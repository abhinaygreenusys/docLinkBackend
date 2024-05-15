const cron = require("node-cron");
const sendNotification = require("./sendNotification.utils");
const NotificationModel = require("../models/Notification.model");
// schedule, task:task, deviceToken

let cronId
const createCronjob = ( data) => {
    const temp = cron.schedule(data.schedule, async function(){
        try{
        console.log(data.schedule,data.task,data.deviceToken,data?.task?.prescription);
        if (data?.task?.taskType === "medicine") {
            const message = `Please take ${data?.task?.name} medicine dosage ${data?.task?.dosage}`;
            const notify = await sendNotification({
                type: data?.task?.taskType,
                body: message,
                data:{},
                deviceToken:data?.deviceToken,
              });

              const notificationRes = await NotificationModel.create({
                type: data?.task?.taskType,
                typeId: data?.task?.prescription,
                body: message,
                data:{},
              });
          
            console.log(message);
        } else if (data?.task?.taskType === "exercise") {
          const message = `It's time for your ${data?.task?.name} exercise `;
          const notify = await sendNotification({
            type: data?.task?.taskType,
            body: message,
            data: {},
            deviceToken:data?.deviceToken,
          });

          const notificationRes = await NotificationModel.create({
            type: data?.task?.taskType,
            typeId: data?.task?.prescription,
            body: message,
            data:{},
          });

          console.log(message);
        } else if (data?.task?.taskType === "diet") {
          const message = `Please follow the diet ${data?.task?.name} in ${data?.task?.partOfDay}`;
          
          
          const notify = await sendNotification({
            type: data?.task?.taskType,
            body: message,
            data: {},
            deviceToken:data?.deviceToken,
          });

          const notificationRes = await NotificationModel.create({
            type: data?.task?.taskType,
            typeId: data?.task?.prescription,
            body: message,
            data:{},
          }); 
          console.log("diet");
        }
        console.log("cron started");
      }catch(err){
          console.log(err)
        }
  });
  temp.start();
    // cronId=temp; 
//   return temp;
};

// function removeCron(){
//       cronId.stop();
// }

//  function fn({ schedule, task, deviceToken }) {
    
// }

module.exports = {createCronjob,removeCron};
