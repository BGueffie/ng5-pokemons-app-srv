const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');


var BCRYPT_SALT_ROUNDS = 12;
router.post('/register',(req,res) => {
    const newUser = new User(req.body);
    bcrypt.hash(newUser.password, BCRYPT_SALT_ROUNDS)
          .then((hashedPassword) => {
              newUser.password = hashedPassword
              return newUser.save((err,user) => {
                  if (err) return res.status(500).json(err);
                  req.login(req.body, (err) => {
                      if(err) console.log('err in register | req.login()',err);
                      res.status(201).json(user);
                  });
              });
          });
});

router.post('/login', async (req,res) => {
    try {
        var user = await User.findOne({ username : req.body.username }).exec();
        if(!user) {
            return res.status(400).send({ msg: "The username does not exist" });
        }
        if(bcrypt.compareSync(req.body.password,user.password)) {
            return res.status(200).send({msg: "You have logged in"});
        }
        res.status(400).send({ msg: "The password is invalid" });
    } catch (error) {
        res.status(500).send(error);
    }
        

});


router.get('/logout', (req,res) => {
    req.logOut();
    res.status(200).json({ msg: 'logged out succesfully'});
});

router.get('/users', (req,res) => {
    User.find()
        .exec()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json({ msg : "Users not found", error : err}));

});
module.exports = router;