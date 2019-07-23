import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";


export const home = async (req, res) => {
    try {
        const videos = await Video.find({}).sort({
            _id: -1
        });
        res.render("home", {
            pageTitle: "Home",
            videos
        });
    } catch (error) {
        console.log(error);
        res.render("home", {
            pageTitle: "Home",
            videos: []
        });
    }
};

export const search = async (req, res) => {
    const {
        query: {
            term: searchingBy
        }
    } = req;
    // const searchingBy = req.query.term;
    let videos = [];

    try {
        videos = await Video.find({
            title: {
                $regex: searchingBy,
                $options: "i"
            }
        });
    } catch (error) {
        console.log(error);
    }
    
    if(videos.length===0){
        req.flash("error","Can't Find Videos");
    }
    res.render("search", {
        pageTitle: "Search",
        searchingBy,
        videos
    });
};

export const getUpload = (req, res) =>res.render("upload", { pageTitle: "Upload"});

export const postUpload = async (req, res) => {
    const {
        body: {
            title,
            description
        },
        file: {
            location
        }
    } = req;
    const newVideo = await Video.create({
        fileUrl: location,
        title,
        description,
        creator:req.user.id
    });
        req.user.videos.push(newVideo.id);
        req.user.save();
        req.flash("success","Video Uploaded");
    res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
    const {
        params: {
            id
        }
    } = req;

    try {
        const video = await Video.findById(id)
        .populate("creator")
        .populate("comments");// populate는 객체만 가져올수 있다. join과 같은 개념
        res.render("videoDetail", {
            pageTitle: video.title,
            video
        });
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const getEditVideo = async (req, res) => {
    const {
        params: {
            id
        }
    } = req;
    try {
        const video = await Video.findById(id);
        if(String(video.creator) !== req.user.id){
            throw Error();
        }else{
            res.render("editVideo", {
                pageTitle: `Edit ${video.title}`,
                video
            });
        }
    } catch (error) {
        req.flash("error","Video not found");
        res.redirect(routes.home);
    }
}

export const postEditVideo = async (req, res) => {
    const {
        params: {
            id
        },
        body: {
            title,
            description
        }
    } = req;

    try {
        await Video.findOneAndUpdate({
            _id: id
        }, {
            title,
            description
        });
        req.flash("success","Video updated");
        res.redirect(routes.videoDetail(id));
    } catch (error) {
        req.flash("error","Can't Update Video");
        res.redirect(routes.home);
    }
};

export const deleteVideo = async (req, res) => {
    const {
        params: {
            id
        }
    } = req;
    try {
        const video = await Video.findById(id);
        
        if(String(video.creator) !== req.user.id){
            throw Error();
        }else{
            await Video.findOneAndRemove({
                _id: id
            });
            req.flash("success","Video deleted");
        }
    } catch (error) {
        req.flash("error","Can't Delete Video");
        console.log(error);
    }
    res.redirect(routes.home);
}

// Register Video View

export const registerView = async(req, res) => {
    const {
        params:{id}
    }=req;
    try{
        const video = await Video.findById(id);
        video.views+=1;
        video.save();
        res.status(200);
    } catch(error){
        res.status(400);
    } finally{
        res.end();
    }
};

// Add Comment

export const postAddComment = async(req,res) => {
    const{
        params:{id},
        body: {comment},
        user
    }=req;
try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
        text:comment,
        creator:user.id
    });  
    video.comments.push(newComment.id);
    video.save();
} catch (error) {
        res.status(400);
} finally{
    res.end();
}
};