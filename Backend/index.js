const express = require("express")
const cors = require("cors");
require ("dotenv").config();
const indexRouter = require("./routes/index.routes.js");
const pool = require('./database/db.js')

const app = express();
const PORT = process.env.PORT

app.use(cors());
app.use(express.json());

app.use('/api', indexRouter)

app.listen(PORT,() => {
        console.log(`Servidor ejecutandose en http://localhost:${PORT}`)
    }
    
)