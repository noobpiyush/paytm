const express = require("express");
const rootRouter = require("./routes/index");
const cors = require("cors");
const app = express();

app.use(cors(
    {
        origin: ["https://pytm12.netlify.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
));
app.use(express.json());

app.get("/hi", (req, res) => {
    res.json({
        msg: "hii"
    })
})

app.use("/api/v1", rootRouter);
console.log("connected");
app.listen(4000);