import express from "express"
import userRouter from "./routers/users.route"

const app = express()

app.use(express.json())
app.use("", userRouter)
app.listen(3333)

export default app
