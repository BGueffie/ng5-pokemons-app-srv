const express = require('express');
const router = express.Router();
const Pokemon = require("../models/pokemon");

//Get all pokemons sorted by Pokemon ID
router.get('/pokemons', (req,res) => {
    Pokemon.find()
        .sort("pokemonId")  
        .exec()
        .then(pokemons => res.status(200).json(pokemons))
        .catch(err => res.status(500).json({ msg : "Pokemons not found", error : err}));

});

//Get pokemon by id
router.get('/pokemons/:id',(req,res) => {
    const id = req.params.id;
    Pokemon.findById(id)
        .then(pokemon => res.status(200).json(pokemon))
        .catch(err => res.status(500).json({ message: "Pokemon not found", error: err})); 
});

//Post pokemon with model in ../model/pokemon
router.post('/pokemons', (req,res) => {
    console.log(`req.body`, req.body);
    const pokemon = new Pokemon(req.body);
    pokemon.save((err,pokemon) => {
        if(err) {
            return res.status(500).json(err);
        }
        res.status(201).json(pokemon);
    });
});

router.delete('/pokemons/:id', (req,res) => {
    const id = req.params.id;
    Pokemon.findByIdAndDelete(id, (err,pokemon) => {
        if(err) {
            return res.status(500).json(err);
        }
        res.status(202).json({message : `Pokemon with id ${pokemon._id} has been deleted`});
    });
});

router.put('/pokemons/:id', (req,res)=> {
    const id = req.params.id;
	const conditions = { _id: id};
	const blogPost = {...req.body };
	const update = { $set: blogPost };
	const options = {
		upsert: true,
		new: true
    };
    Pokemon.findOneAndUpdate(conditions, update, options, (err, response) => {
		if(err) return res.status(500).json({ msg: 'update failed', error: err });
		res.status(200).json({ msg: `document with id ${id} updated`, response: response });
	});
});
module.exports = router;