import Comment from "../models/comment.js";


export const createComment = async (req, res) => {
    try {
        const { videoId, text } = req.body;

        const newComment = new Comment({
            videoId,
            text,
        });

        const savedComment = await newComment.save();

        if (!savedComment) {
            throw new Error("Failed to create comment");
        }

        res.status(201).json({ msg: "Success", comment: savedComment });
        return;
    } catch (error) {
        res.status(500).json({ msg: error.message });
        return;
    }
};

export const fetchComments = async (req, res) => {
    try {
        const {videoId} = req.params;

        console.log("--------------------vid",videoId);

        const comments = await Comment.find({ video: videoId });
        console.log("comments--------",comments)
        res.status(200).json({ comments: comments });
        return;

    } catch (error) {
        res.status(500).json({ msg: error.message });
        return;
    }
};

export const getCommentById = async (req, res) => {

    console.log("req.params.commentId--", req.params.commentId);
    
    try {
        const {commentId} = req.params;
        const comment = await Comment.findOne({commentId: commentId});

        if (!comment) {
            throw new Error("Comment not found");
        }
        res.status(200).json({ comment: comment });
        return;
    } catch (error) {
        console.log("--------------------------",error)
        res.status(500).json({ msg: error.message });
        return;
    }
};


//deleting comment by commentId
export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            throw new Error("Comment not found");
        }
        res.status(200).json({ msg: "Comment deleted successfully" });
        return;
    } catch (error) {
        res.status(500).json({ msg: error.message });
        return;
    }
};

export const editComment = async (req, res) => {
        try {
            const commentId = req.params.commentId;
            const { text } = req.body;
            const updatedComment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });
            if (!updatedComment) {
                throw new Error("Comment not found");
            }
            res.status(200).json({ msg: "Comment updated successfully", comment: updatedComment });
            return;

        } catch (error) {
            res.status(500).json({ msg: error.message });
            return;
        }
}