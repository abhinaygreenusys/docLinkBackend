const cron = require('node-cron');


const createCronjob=(schedule,task)=>{
    console.log("hello");
    const temp=cron.schedule("* * * * * *", ()=>{
         console.log("cron started");
    });

    temp.start();

}

module.exports = createCronjob;
