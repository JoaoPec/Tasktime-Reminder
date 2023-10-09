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
dbConnect()

//get routes

app.get("/", async (req, res) => {

    const user = await User.findById(req.session.userId)

    if (user){
        
        res.send("Hello " + user.name)
        console.log(req.session.userId)

    }
})




//register,login and logout routes


app.post("/register", (req, res) => {

    User.findOne({ username: req.body.username})
        .then((user) => {
            if (user) {
                res.send("User already exists");
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

                            console.log(req.session.userId)
                            
                            res.redirect("/")

                        })
                    }).catch((err) => {
                        console.error(err);
                        res.status(500).send("Error registering new user please try again.");
                    })

            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error checking for existing user");
        });
});

app.post("/login",async (req, res) => {

    if(req.isAuthenticated()){
        
        res.send("You are already logged in")
        
    }

    const user = await User.findOne({ username: req.body.username })

    if (user){

            req.login(user, (err) => {

            if (err) {
                console.error(err);
                res.status(500).send("Error logging in");
            }

            req.session.userId = user._id.toString();

            console.log(req.session.userId)

            console.log("User logged in")

            res.redirect("/")

        })

    } else {
        res.send("User does not exist, please register")
    }
})

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


app.post("/addTask", (req,res) => {


        const task = {
            description: req.body.description,
            when: req.body.when
        }

        User.findByIdAndUpdate(req.session.userId, {$push: {tasks: task}}) 
            .then((user) => {
                console.log(user.tasks)
            })

        res.send("You are not logged in")


    

})





//listen

app.listen("3000", () => {
    console.log("Server is running on port 3000")
})
