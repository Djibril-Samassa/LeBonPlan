const mongoose = require("mongoose");

const annonceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image: {
        required: true,
        type: String,
        get: v => `${root}${v}`
    }
})

const Annonce = mongoose.model("Annonce", annonceSchema);

module.exports = Annonce;