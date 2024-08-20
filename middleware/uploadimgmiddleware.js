const fs = require('fs')

exports.uploadmiddleware = async (req, res, next)=> {
    try {
        if(!req.files || Object.values(req.files).flat().length === 0){
            return res.status(400).json({
                message: "No file selected"
            })
        }

        const file = Object.values(req.files).flat()
        file.forEach((files)=> {
            if(files.mimetype !== "image/jpeg" && files.mimetype !== "image/png" && files.mimetype !== "image/webp" && files.mimetype !== "image/gif"){
                removeFile(files.tempFilePath)
                return res.status(400).json({
                    message: "Unsupported File"
                })
            }
            if(files.size > 1024 * 1024 * 5){
                removeFile(files.tempFilePath)
                return res.status(400).json({
                    message: "File size is too much large"
                })
            }
            // return res.status(200).json({
            //     message: "Image Successfully uploaded"
            // })
        })
        next()

    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

const removeFile = (path)=>{
    fs.unlink(path, (err)=>{
        if(err) throw err;
    })
}