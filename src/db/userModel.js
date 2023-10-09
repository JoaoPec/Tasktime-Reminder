import mongoose from "mongoose"
import passportLocalMongoose from "passport-local-mongoose"
import passport from "passport"

const userSchema = new mongoose.Schema({
    
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    password: String,
    username: String,
    phoneNum: Number,
    tasks: [{
        description: String,
        when: Number
    }]
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", userSchema)

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())

passport.deserializeUser(User.deserializeUser())

export default User
