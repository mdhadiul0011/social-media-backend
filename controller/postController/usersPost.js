const Post = require("../../model/postmodel")

exports.createPost = async (req, res) => {
    try {
        const post = await new Post(req.body).save()
        return res.json(post)
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}