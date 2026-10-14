import mongoose from "mongoose";
import Game from "../../models/Games/game.model.js"



export const getGames = async(req , res , next) => {

    try{

        const games = await Game.find();

        return res.status(200).json({
            success : true,
            message : "Games fetched successfully",
            data: games
        });
    }catch(err){
        next(err);
    }
}


export const getGame = async(req, res, next) => {
    try{

        const gameId = req.params.id;

        if(!mongoose.isValidObjectId(gameId)){
            return res.status(400).json({
                success : false,
                message : "Error invalid game id"
            });
        }

        const game = await Game.findById(gameId);

        if(!game){
            return res.status(404).json({
                success : false,
                message : "Error game not found"
            });
        }

        return res.status(200).json({
            success : true,
            message : "Game fetched successfully",
            data : game
        });

    }catch(err){
        next(err);
    }
}

