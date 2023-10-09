import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const uri = "mongodb://127.0.0.1:27017/taskManager"

const dbConnect = () => {
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connected to MongoDB")
    }).catch((err) => {
        console.error("Erro ao conectar ao MongoDB: " + err)
    })
}

export default dbConnect