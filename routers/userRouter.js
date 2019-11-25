import express from "express";
import { User, validate } from "../models/user";
import { copyFile } from "fs";

const userRouter = express.Router();

userRouter.get('/',function(req,res,next){
    if(req.session.email){
        res.render('home',{
            score: req.session.score
        });
    }
    else{
        res.render('login',{
            title: "Express"
        });
    }
});

userRouter.get('/sign_up',function(req,res,next){
    res.render("sign_up");
});

userRouter.post('/sign_up', async function(req,res,next){
    console.log(req.body);
    const { error } = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).send('That Email already exisits!');
    }else{
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            score: 0,
            highscore: 0
        });
        await user.save();
        res.redirect('/');
    }
});

userRouter.get('/login',function(req,res,next){
    let session = req.session;
    console.log(session.email);
    res.render("login", {
        session : session
    });
});

userRouter.post('/login',async function(req,res,next){
    let user = await User.findOne({email: req.body.email});
    if(user){
        if(user.password==req.body.password){
            res.cookie("user", req.body.email , {
                expires: new Date(Date.now() + 900000),
                httpOnly: true
            });
            req.session.email = req.body.email;
            req.session.score = user.score;
            res.redirect("/");
        }else{
            console.log("password가 다릅니다!")
            res.redirect("login");
        }
    }else{
        console.log("email이 존재하지 않습니다!")
        res.redirect("login");
    }
})

userRouter.get("/rank",async function(req,res,next){
      
    const scorearr = await User.find({}).sort({score : -1});
    req.body = scorearr;
    var namearr = new Array;
    var scoreArr = new Array;
    var j=0*0;
    for(var i in scorearr)
    {
        namearr[j] = scorearr[i].name;
        scoreArr[j] = scorearr[i].score;
        j++;
    }
    res.render("rank",{
    scorearr: scoreArr,
    namearr: namearr
    })
})

userRouter.get("/logout", function(req,res,next){
    console.log("click");
    req.session.destroy();
    res.clearCookie('sid');

    res.redirect("login")
})

userRouter.get("/gameOver/:number", async function(req,res,next){
    var num = req.params.number;
    let user = await User.findOne({"email": req.session.email});
    
    const updateUser = {
        'id': user._id,
        'name': user.name,
        'email': user.email,
        'password': user.password,
        'score': num
    };
    const status = await User.findByIdAndUpdate(user._id,updateUser,{new: true},(err,doc) =>{
        if(err){
            console.log("Wrong");
        }
        console.log("Doc : ",doc);
    });

    req.session.score=num;
    res.render("gameOver",{
        score: num
    });
})

export default userRouter;