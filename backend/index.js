const express = require("express");
const rootRouter = require("./routes/index");
const cors = require("cors");
const app = express();

app.use(cors(
    {
        origin: ["*"],
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