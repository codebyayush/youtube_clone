import Channel from "../models/channel.js";


export const fetchChannel = async (req, res) => {

    try {

        const channelId = req.params.channelId;

        const channel = await Channel.findOne({_id: channelId});

        if(!channel){
            throw new Error("Channel not found");
        }

        return res.status(200).json({result: channel});

    } catch (error) {
        return res.status(500).json({msg: "Failed to fetch channel details"});
    }
}
