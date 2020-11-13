const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
    pokemonId: Number,
    name: String,
    hp: Number,
    cp: Number,
    picture: String,
    types: [String],
    created: {type : Date, default: Date.now}
});

module.exports = mongoose.model('Pokemon',pokemonSchema);