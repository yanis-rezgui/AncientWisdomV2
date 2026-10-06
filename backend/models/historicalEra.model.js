import mongoose from "mongoose";

const historicalEraSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            minLength: 1,
            maxLength: 150,
            trim: true
        },

        startYear: {
            type: Number,
            required: [true, "Start year is required"]
        },

        endYear: {
            type: Number,
            required: [true, "End year is required"]
        },

        description: {
            type: String,
            required: [true, "Description is required"],
            minLength: 5,
            trim: true
        },

        image: {
            url: {
                type: String,
                required: true
            },
            publicId: {
                type: String,
                required: true
            }
        },

        sections: [
            {
                title: {
                    type: String,
                    required: true,
                    minLength: 1,
                    maxLength: 150,
                    trim: true
                },

                content: {
                    type: String,
                    required: true,
                    minLength: 10,
                    trim: true
                }
            }
        ]
    },
    { timestamps: true }
);

const HistoricalEra = mongoose.model("HistoricalEra", historicalEraSchema);

export default HistoricalEra;