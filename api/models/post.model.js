import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        content:{
            type: String,
            required: true,
        },
        title:{
            type: String,
            required: true,
            unique: true,
        },
        image:{
            type: String,
            default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEbJ98lSmCfnL6i6ne8O8yRG5xOh8n8Ohv7g&s'
        },
        category:{
            type: String,
            default: 'uncategorized'
        },
        slug:{
            type: String,
            required: true,
            unique: true,
        }, 
    },{timestamps: true}
)

const Post = mongoose.model('Post', postSchema)

export default Post