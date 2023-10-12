import User from './db/userModel.js';

async function checkScheduledTasks() {
    const now = new Date();

    try {
        const users = await User.find({ 'tasks.when': now }).exec();

        for (const user of users) {
            const matchingTasks = user.tasks.filter((task) => task.when === now);
            
            for (const task of matchingTasks) {
                const message = await client.messages.create({
                    from: 'whatsapp:+14155238886',
                    body: `Olé ${user.name}, Esse é um lembrete da seguinte tarefa:  ${task.description}!`,
                    to: `whatsapp:${user.phoneNum}`
                });

                console.log(`Sending message for task: ${task.description}`);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

export default checkScheduledTasks;
