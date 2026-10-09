import Tips from "../models/Learn/tips.model.js"



export const getTips = async(req , res , next) => {

    try{

        const tips = await Tips.findOne();

        if(!tips){
            return res.status(404).json({
                success :true,
                message : "Error tips not found"
            });
        }

        return res.status(200).json({
            success : true,
            message : "Tips fetched successfully",
            data : tips
        });

    }catch(err){
        next(err);
    }
}


export const updateTips = async (req, res, next) => {
    try {
        const { introduction, tips, conclusion } = req.body;

        // Validate required fields
        if (
            typeof introduction !== "string" ||
            !introduction.trim() ||
            typeof conclusion !== "string" ||
            !conclusion.trim() ||
            !Array.isArray(tips) ||
            tips.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Introduction, tips and conclusion are required.",
            });
        }

        // Validate each tip
        for (const tip of tips) {
            if (
                !tip ||
                typeof tip.title !== "string" ||
                !tip.title.trim() ||
                typeof tip.why !== "string" ||
                !tip.why.trim() ||
                typeof tip.how !== "string" ||
                !tip.how.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Each tip must contain a title, a why and a how.",
                });
            }
        }

        // Find the existing document
        const existingTips = await Tips.findOne();

        if (!existingTips) {
            return res.status(404).json({
                success: false,
                message: "Learning tips not found. Create them first.",
            });
        }

        // Update the document
        existingTips.introduction = introduction.trim();
        existingTips.tips = tips.map((tip) => ({
            ...(tip._id &&
            mongoose.isValidObjectId(tip._id)
                ? { _id: tip._id }
                : {}),
            title: tip.title.trim(),
            why: tip.why.trim(),
            how: tip.how.trim(),
        }));
        existingTips.conclusion = conclusion.trim();

        const updatedTips = await existingTips.save();

        return res.status(200).json({
            success: true,
            message: "Learning tips updated successfully.",
            data: updatedTips,
        });
    } catch (err) {
        next(err);
    }
};