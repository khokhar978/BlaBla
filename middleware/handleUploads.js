import multer from "multer";
import path from "path";

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads/profilePictures");

    },
    filename:function(req,file,cb){
        cb(null,req.user.id+"profilePic"+path.extname(file.originalname));
    }
})

export default multer({storage:storage});