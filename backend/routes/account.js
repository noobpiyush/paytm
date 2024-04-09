const express = require("express");
const { authMiddleware } = require("../middleware/middleware");
const { Account } = require("../database/db");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.get("/balance",authMiddleware,async (req,res) => {
    const account = await Account.findOne({
        userId:req.userId
    });

    res.json({
        balance:account.balance
    })
});

router.post("/transfer",authMiddleware, async (req,res) => {
    const session  = await mongoose.startSession();

    (await session).startTransaction();

    const {amount, to} = req.body;

    //fetching accounts for transaction

    const account = Account.findOne({
        userId:req.userId
    }).session(session);

    if (!account || account.balance < amount) {
        (await session).abortTransaction();

        return res.status(400).json({
            message:"Insufficient Balance"
        });
    }

    const toAcccount = Account.findOne({
        userId:req.userId
    }).session(session);

    if (!toAcccount) {
        (await session).abortTransaction();

        return res.status(400).json({
            message:"Invalid account"
        });
    }

    // perform the transfer 

    await Account.updateOne({userId: req.userId},{$inc : {balance: -amount}}).session(session);

    await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(session);

    //commit the transaction

    (await session).commitTransaction();

    res.json({
        message: "Transfer sucessful"
    });


})

module.exports = router;