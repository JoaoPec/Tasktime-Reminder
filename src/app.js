import express from "express"
import dbConnect from "./db/connectDB.js"
import User from './db/userModel.js'
import passport from 'passport'
import bodyParser from "body-parser"
import mongoose from "mongoose"
import session from "express-session"
import dotenv from "dotenv"

//dotenv

dotenv.config()

const secret = process.env.SECRET

//middlewares

const app = express()
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false
}))


app.use(passport.initialize())
app.use(passport.session())


//connectDB

await dbConnect()


//get routes




app.get("/",(req, res) => {

    res.render("index")

})


app.get("/list",async (req,res) => {

    if (req.isAuthenticated){

        const user = await User.findById(req.session.userId)

        res.render("list", {user})
    }else{
        res.redirect("/")
    }

})

app.get("/addTask", (req,res) => {
    if (req.isAuthenticated){
        res.render("bot")
    }
    else{
        res.render("index")
    }
})


//register,login and logout routes


app.post("/register", (req, res) => {
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user) {
                req.login(user, (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error logging in after registration");
                    }
                    req.session.userId = user._id.toString();
                    console.log(req.session.userId);
                    res.redirect("/list"); 
                });
            } else {
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    username: req.body.username,
                    phoneNum: req.body.phoneNum
                });

                User.register(newUser, req.body.password)
                    .then((user) => {
                        req.login(user, (err) => {
                            if (err) {
                                console.error(err);
                                res.status(500).send("Error logging in after registration");
                            }
                            req.session.userId = user._id.toString();
                            console.log(req.session.userId);
                            res.redirect("/list");
                        })
                    }).catch((err) => {
                        console.error(err);
                        res.status(500).send("Error registering new user, please try again.");
                    });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error checking for existing user");
        });
});


app.get("/logout", (req, res) => {

    req.logout((err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error logging out");


        }

        console.log("User logged out")
        req.session.destroy()
        res.redirect("/")
    })

})

app.post("/addTask", (req, res) => {

        const minutesToReminder = parseInt(req.body.when);

        if (!isNaN(minutesToReminder)) {
            const now = new Date();
            const reminderTime = new Date(now.getTime() + minutesToReminder * 60000); 

            const task = {
                description: req.body.description,
                when: reminderTime
            };
 
            console.log("The task will be sent at " + reminderTime)

            User.findByIdAndUpdate(req.session.userId, { $push: { tasks: task } })
                .then((user) => {
                    console.log(user.tasks);
                    res.redirect("/list");
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).send("Error adding task.");
                });
        } else {
            res.status(400).send("Invalid input for reminder time.");
        }
    
});

app.post("/deleteTask", async (req, res) => {
    try {
        const taskId = req.body.taskId;
        console.log(taskId);
        const result = await User.findByIdAndUpdate(req.session.userId, { $pull: { tasks: { _id: taskId } } });
        console.log("Task deleted");
        res.redirect("/list");
    } catch (error) {
        console.error("Erro ao excluir tarefa:", error);
        res.status(500).send("Erro ao excluir tarefa");
    }
});



//listen

app.listen("3000", () => {
    console.log("Server is running on port 3000")
})
