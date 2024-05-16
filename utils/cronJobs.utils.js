const cron = require("node-cron");
const sendNotification = require("./sendNotification.utils");
const NotificationModel = require("../models/Notification.model");
const PatientModel = require("../models/Patient.model");

const createCronjob =( data) => {
     let cronId = cron.schedule(data.schedule, async function(){
        try{
          let message="Node Message"
          let taskType;
        console.log(data.schedule,data.task,data.deviceToken,data?.task?.prescription);
    
        if (data?.task?.taskType === "medicine") {
             message = `Please take ${data?.task?.name} medicine dosage ${data?.task?.dosage}`;
            taskType=data?.task?.taskType;

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
           message = `It's time for your ${data?.task?.name} exercise `;
           taskType=data?.task?.taskType;
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
           message = `Please follow the diet ${data?.task?.name} in ${data?.task?.partOfDay}`;
           taskType=data?.task?.taskType;
          
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
        }

          // const notify = await sendNotification({
          //   type:taskType,
          //   body: message,
          //   data: {},
          //   deviceToken:data?.deviceToken,
          // });


          //   const notificationRes = await NotificationModel.create({
          //   type: taskType,
          //   typeId: data?.task?.prescription,
          //   body: message,
          //   data:{},
          // }); 
          // console.log(message);



        console.log("cron started");

      }catch(err){
          console.log(err)
        }
  },{  
  });
  cronId.start();
    // cronId=temp;
    console.log("options=",cronId.options.name); 
//   return temp;
// console.log(cron.get(cronId))
return cronId?.options?.name;
};



function stopCron(cronJobs){

  const allCrons=cron.getTasks()
  console.log(allCrons);
  for (const [key, value] of allCrons.entries()) {
        for(const id of  cronJobs){
            if(id === value?.options?.name){
              console.log("if")
              value.stop();
            }
        }
    // console.log("all task=",key, value); 
  }
}
 

module.exports = {createCronjob,stopCron};
