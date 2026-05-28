import "dotenv/config"
import express from "express"
import cors from "cors"
import authRouter from "./routes/auth.js"

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

app.use("/auth", authRouter)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
