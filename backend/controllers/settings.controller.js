import Settings from "../models/settings.model.js";

// GET — Récupérer les paramètres
export const getSettings = async (req, res, next) => {
    try {
        const settings = await Settings.findOne().lean();

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: "Settings not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Settings fetched successfully",
            data: settings,
        });
    } catch (err) {
        next(err);
    }
};

// PUT — Créer ou mettre à jour les paramètres
export const updateSettings = async (req, res, next) => {
    try {
        const { name, slogan, email, socialLinks } = req.body;

        const updates = {};

        if (name !== undefined) updates.name = name;
        if (slogan !== undefined) updates.slogan = slogan;
        if (email !== undefined) updates.email = email;
        if (socialLinks !== undefined) {
            updates.socialLinks = socialLinks;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No settings provided for update",
            });
        }

        const settings = await Settings.findOneAndUpdate(
            {},
            { $set: updates },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            data: settings,
        });
    } catch (err) {
        next(err);
    }
};
