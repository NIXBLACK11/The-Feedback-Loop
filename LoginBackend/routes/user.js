require('dotenv').config();
const axios = require("axios");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { userMiddleware } = require("../middlewares/userMiddleware");
const { uploadVideoMiddleware } = require("../middlewares/uploadVideoMiddleware");

const { User } = require("../db/user");
const { Video } = require("../db/video");

const { createUser, checkUser } = require("../config/user");
const { uploadVideo } = require("../config/video");

const SECRET = process.env.SECRET;

//route to see all users
router.get('/', async(req, res) => {
    try {
        const users = await User.find({});
        const filteredUsers = users.map((user) => {
            return {
                userName: user.userName,
                userEmail: user.userEmail,
                userVideos: user.userVideos
            };
        });
        res.status(200).json({
            users: filteredUsers
        });
    } catch(error) {
        res.status(500).json({
            message: "Database error"
        })
    }
});

//route to create user
router.post('/signup', async(req, res) => {
    const payload = req.body;
    const parsedPayload = createUser.safeParse(payload);
    if(!parsedPayload.success) {
        res.status(411).json({
            message: "Wrong Input"
        })
        return;
    }
    let token;
    try {
        const user1 = await User.findOne({
            userName: parsedPayload.data.userName,
        });

        if(user1) {
            res.status(401).json({
                message: "User already exists"
            })
            return;
        }
        const user2 = await User.findOne({
            userEmail: parsedPayload.data.userEmail,
        });

        if(user2) {
            res.status(401).json({
                message: "User already exists"
            })
            return;
        }
        
        const createdUser = await User.create({
            userName: parsedPayload.data.userName,
            userEmail: parsedPayload.data.userEmail,
            userPassword: parsedPayload.data.userPassword
        })
        const _id = createdUser._id;
        token = jwt.sign({
            _id
        }, SECRET);
    } catch (error) {
        res.status(500).json({
            message: "Database error : "+error
        })
        return;
    }
    
    res.status(200).json({
        message: "User created",
        token: token
    })
});

//route for the user to signin
router.post('/signin', async(req, res) => {
    const payload = req.body;
    const parsedPayload = checkUser.safeParse(payload);
    console.log(parsedPayload.success);
    if(!parsedPayload.success) {
        res.status(411).json({
            message: "Wrong Input"
        })
        return;
    }
    let token;
    try {
        const user = await User.findOne({
            userName: parsedPayload.data.userName,
            userPassword: parsedPayload.data.userPassword
        });

        if(!user) {
            res.status(401).json({
                message: "User does not exist"
            })
            return;
        }

        const _id = user._id;
        token = jwt.sign({
            _id
        }, SECRET);
    } catch (error) {
        res.status(500).json({
            message: "Database error : "+error
        })
        return;
    }
    
    res.status(200).json({
        message: "User signed in",
        token: token
    })
});

//route to check user validity
router.get('/check/:username', userMiddleware, async(req, res) => {
    res.status(200).json({
        valid: true
    });
});

//route to get a user
router.get('/:username', async(req, res) => {
    try {
        const user = await User.findOne({
            userName: req.params.username
        });
        const filteredUsers = {
            userName: user.userName,
            userEmail: user.userEmail,
            userVideos: user.userVideos
        };
        res.status(200).json({
            user: filteredUsers
        });
    } catch(error) {
        res.status(500).json({
            message: "Database error"
        })
    }
});

//route to add metaData for video
router.post('/:username/videoData', userMiddleware, async(req, res) => {
    const payload = req.body;
    const parsedPayload = uploadVideo.safeParse(payload);

    if (!parsedPayload.success) {
        return res.status(411).json({
            message: "Wrong Input"
        });
    }

    try {
        const findVideo = await Video.findOne({
            videoTitle: parsedPayload.data.videoTitle,
            videoDescription: parsedPayload.data.videoDescription,
            videoGenre: parsedPayload.data.videoGenre
        });

        if (findVideo) {
            return res.status(401).json({
                message: "Video already exists"
            });
        }

        const userName = req.params.username;

        const newVideo = await Video.create({
            videoTitle: parsedPayload.data.videoTitle,
            videoDescription: parsedPayload.data.videoDescription,
            videoUploadDate: new Date(),
            videoGenre: parsedPayload.data.videoGenre
        });
        
        const videoId = newVideo._id;
        
        await Video.updateOne(
            { _id: videoId },
            { $set: { videoPath: `../uploads/${videoId}.mp4` } }
        );

        await User.updateOne({
            userName: userName
        }, {
            "$push": {
                userVideos: videoId
            }
        });

        return res.status(200).json({
            message: "Video metaData created successfully",
            videoId: videoId
        });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({
            message: "Database error"
        });
    }
});

//route to add video for user
router.post('/:username/video', userMiddleware, uploadVideoMiddleware, async (req, res) => {
    let path = "/home/siddharth/Desktop/programs/LoginBackend/uploads/"+req.fileName;

    const findVideo = await Video.findOne({
        videoPath: "../uploads/"+req.fileName
    });

    const genre = findVideo.videoGenre;

    const response = await axios.get(`http://127.0.0.1:5000/get_genre?path=${path}&genre=${genre}`);

    res.status(200).json({
        data: response.data
    });
});


module.exports = router;