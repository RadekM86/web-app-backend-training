const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const verifyToken = require('../verifyToken')

const {registerValidation, loginValidation} = require('../validation');

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body)
    if(error) {
        return res.status(400).send({message: error.details[0].message})
    }
    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) return res.status(400).send({message: 'User exists!'})
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hashPassword
    });
    try {
        await user.save()
        res.send(user)
    } catch (error) {
        res.status(500).send({message: error})
    }
})

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body)
    if(error) {
        return res.status(400).send({message: error.details[0].message})
    }
    const user = await User.findOne({ email: req.body.email })
    console.log('user is logging')
    if(!user) return res.status(404).send({message: 'Email or password incorrect'});
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(404).send({message: 'Email or password incorrect'});
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token)
    res.status(200).send({data: token});
})

router.get('/users', verifyToken, async (req, res) => {
    const users = await User.find({})
    try {
        res.send(users)
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

router.patch('/modify', async (req, res) => {
    const user = await User.findOne({ _id: req.body._id })
    if (!user) return res.status(404).send({message: 'User not found!'})
    const salt = await bcrypt.genSalt(10)
    const hashPassword = req.body.password && await bcrypt.hash(req.body.password, salt)
    try {
        const result = hashPassword ? await User.updateOne(
            { _id: req.body._id }, { $set: { ...req.body, password: hashPassword } }
        ) : await User.updateOne(
            { _id: req.body._id }, { $set: { ...req.body } }
        )
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

router.delete('/delete', async (req, res) => {
    try {
        const result = await User.deleteOne(
            { _id: req.body._id }
        )
        res.status(200).send({message: 'User deleted'})
    } catch (error) {
        res.status(500).send({ message: error })
    }
})


module.exports = router;