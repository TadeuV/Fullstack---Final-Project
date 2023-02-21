require(`dotenv`).config();
const express = require(`express`);
const mongoose = require('mongoose');
const cors = require('cors')
const port=process.env.PORT || 8080;

const app = express();
const router=require(`./routes/router`);
const userRoutes=require(`./routes/user`);

app.use(cors({
    origin: "http://localhost:5173",
}))

app.use(express.json())


app.use('/user',userRoutes)


mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        app.listen(port,()=>{
            console.log("Server running at port "+port )
        })
})
    .catch((error)=>{
        console.log(error)
})
