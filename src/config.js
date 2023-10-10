import dotenv from "dotenv"

dotenv.config()

const accountSid = process.env.ACCOUNT_SID

const authToken = process.env.AUTH_TOKEN

export { accountSid, authToken }
