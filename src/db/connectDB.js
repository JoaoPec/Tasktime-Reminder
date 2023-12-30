import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const uri = `mongodb+srv://Joao:${process.env.PSWD}@taskdb.dzgerrv.mongodb.net/?retryWrites=true&w=majority`


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
