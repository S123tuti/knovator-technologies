const userModel = require("../models/userModel");
const postModel = require("../models/postModel");

const isValidLatitude = (latitude) => {
  return typeof latitude === 'number' && latitude >= -90 && latitude <= 90;
};

const isValidLongitude = (longitude) => {
  return typeof longitude === 'number' && longitude >= -180 && longitude <= 180;
};
const isValidType = (value) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return false;
  }
  return true;
};
const createPost = async (req, res) => {
  try {
    const { title, body, latitude, longitude } = req.body;
    const createdBy = req.user._id;

    if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) 
      return res.status(400).send({status:false, message: 'Invalid latitude or longitude' });
    if(!isValidType(title))
       return res.status(400).send({status:true,msg:"please provide valid title"})
    if(!isValidType(body))
        return res.status(400).send({status:true,msg:"please provide valid body"})

    const validUser = await userModel.find({createdBy})
    if(!validUser) return res.status(400).send({status:false,"msg":"User not Exit"})

    const newPost ={
      title,
      body,
      createdBy,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    };
    let post = await postModel.create(newPost)
    res.status(201).send({status:true,msg:"post created Successfully", post});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLocationData = async (req,res) =>
{
    try {
    const { latitude, longitude } = req.query;
    const userId = req.user._id;
  
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const posts = await postModel.find({"createdBy":userId,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          }
        }
      }

    }).exec();

    if(posts.length > 0)
      return res.status(200).send({status:true,data:posts})
    else 
      return res.status(400).send({status:false,msg:"No data found"})
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const updatePost = async(req, res) => 
{
    try{
        const postId = req.params.postId;
        const postUpdateData = req.body;

        if (Object.keys(postUpdateData).length == 0) {
            return res.status(400).send({ status: false, msg: "Please enter Data to be updated" });
        }
        let post = await postModel.findOneAndUpdate(
            { _id: postId},
            {
                $set: {body: postUpdateData.body, title: postUpdateData.title},
            },
            { new: true });

            if (!post) {
                return res.status(404).send({ status: false, msg: "Post was deleted" })
            }
            return res.status(200).send({ status: true, data: post });
    
        }
        catch (error) {
            return res.status(500).send({ status: false, Error: error.message })
        }
    }

    const deletePost = async function (req, res) {
        try {
            let postIdData = req.params.postId
            let post = await postModel.findById(postIdData)
            // ======================== if the post is already deleted =======================================
            if (!post) {
                return res.status(404).send({ status: false, message: "The post is already deleted" })
            }
            //=============================== if post is not deleted and want to delete it ====================

            let userId = req.user._id

            let deletedPost = await postModel.deleteOne({ _id: postIdData, createdBy: userId })
            return res.status(200).send({ status: true, msg: "Data is successfully deleted" })
        }
        catch (error) {
            return res.status(500).send({ status: false, Error: error.message })
        }
    }
    

const getActiveCount = async (req,res) => 
    {
    try {
    const userId = req.user._id;
    const activeCount = await postModel.countDocuments({createdBy:userId, active: true }).exec();
    const inactiveCount = await postModel.countDocuments({createdBy:userId ,active: false }).exec();
    
    res.send({status:true, activeCount,inactiveCount });
  } catch (error) {
    console.error('Error counting posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
    }



module.exports = { createPost, updatePost, deletePost, getLocationData, getActiveCount};
