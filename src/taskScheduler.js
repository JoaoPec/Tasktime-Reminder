import User from './db/userModel.js';


function checkScheduledTasks() {
    const now = new Date();
    User.find({ 'tasks.when': now }, (err, users) => {
        if (err) {
            console.error(err);
        } else {
            for (const user of users) {
                const matchingTasks = user.tasks.filter((task) => task.when === now);
                for (const task of matchingTasks) {

                    client.messages
                        .create({
                            from: 'whatsapp:+14155238886',
                            body: `Olé ${user.name}, Esse é um lembrete da seguinte tarefa:  ${task.description}!`,
                            to: `whatsapp:${user.phoneNum}`
                        })
                        .then(message => console.log(message.sid)
                        ).catch(err => console.log(err))

                   
                    console.log(`Sending message for task: ${task.description}`);
                }
            }
        }
    });
}

module.exports = {
    checkScheduledTasks,
};

