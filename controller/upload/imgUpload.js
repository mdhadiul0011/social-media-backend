const cloudinary = require("cloudinary")
const fs = require("fs")

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
});

exports.imgUpload = async (req, res) => {
    try {
        const {path} = req.body;
        const files = Object.values(req.files).flat()
        const image = []
        for(const file of files) {
            const url = await uploadtoCloudinary(file, path)
            image.push(url)
            removeFile(file.tempFilePath)
        }
        res.json(image);
        
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

const uploadtoCloudinary = async (file, path) => {
    return new Promise ((resolve)=>{
        cloudinary.v2.uploader.upload(
            file.tempFilePath,
            {
                folder: path
            },
            (err, res)=>{
                console.log(err);
                if(err){
                    removeFile(file.tempFilePath)
                    return res.status(400).json({
                        message: "File upload failed"
                    })
                }
                resolve({
                    url: res.secure_url
                })
            }
        )
    })
}

const removeFile = (path)=>{
    fs.unlink(path, (err)=>{
        if(err) throw err;
    })
}