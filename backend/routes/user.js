const express = require("express");

const router  = express.Router();
const zod = require("zod");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const{User, Account} = require("../database/db");
const {authMiddleware} = require("../middleware/middleware");

const {JWT_SECRET} = require("../config");
const jwt = require("jsonwebtoken")



// Schema definition
const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});



router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(401).json({
            message: "Please enter valid inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const hashedPassword = await bcrypt.hash(req.body.password,saltRounds);

    const user = await User.create({
        username: req.body.username,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.status(200).json({
        message: "User created successfully",
        token: token
    })
})


const signinBody = zod.object({
    username:zod.string().email(),
    password:zod.string()
})

router.post("/signin", async function (req,res) {
    const {success} = signinBody.safeParse(req.body);

    if (!success) {
        res.status(411).json({
            message:"Error while logging in"
        })
    }

    try {
        const user = await User.findOne({
            username:req.body.username,
        })
    
        if (user && await bcrypt.compare(req.body.password,user.password)) {
            const token = jwt.sign({
                userId:user._id
            },JWT_SECRET);
    
            res.status(200).json({
                token:token
            });
    
            return;
        }
    
        res.status(411).json({
            message: "Error while logging in"
        })
        
    } catch (error) {
        console.log("Error while sigin in", error);
        return res.status(500).json({
            message:"Internal server error"
        })
    }

})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware,async (req,res) => {
    const {success} = updateBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({
        _id:req.userId
    },req.body);

    res.json({
        message: "Updated successfully"
    })
});

router.get("/bulk", async (req,res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or:[{
            firstName:{
                "$regex":filter
            },
            
         },
         {
            lastName:{
                "$regex":filter
            }
        }]
    })

    res.json({
        user:users.map(user => ({
            username:user.name,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })

})




module.exports = router;