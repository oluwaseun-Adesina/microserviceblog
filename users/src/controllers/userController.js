const User = require('../model/User')
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const {validateUser, validateUserLogin, validateGetUserDetails, validatePasswordUpdate, validateProfileUpdate} = require('../lib/validations/userValidator')


const secret = process.env.APP_SECRET;
const maxAge =  30 * 60 * 60 * 60;
const createToken = (id) =>{
    return jwt.sign({id}, secret, {
        expiresIn: maxAge
    });
}

// register users
exports.registerUser = async (req, res, next) => {

    try{

        // validate user input
        const { error } = validateUser(req.body);

        if(error){
            return res.status(400).json({ message: error.details[0].message })
        }



        const { name, email, password, role } = req.body

        // check if email already exists
        const emailExist = await User.findOne({email})

        if(emailExist){
            return res.status(400).json({ message: "Email already exists" })
        }

        // hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt)

        // create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        })
    
        const token = createToken({
            id: user._id,
            name: user.name,
            email: user.email
            })
            
        res.status(201).json( {message: "Registered successfully", data: user, auth: token} );

       

    }catch(err){
        console.log(err)
        res.status(400).json({ err });
    }

}

// login users
exports.loginUser = async (req, res, next) => {

    try{

        // validate user input
        const { error } = validateUserLogin(req.body);

        if(error){
            return res.status(400).json({ message: error.details[0].message })
        }

        
        const { email, password } = req.body

        // check if email already exists
        const emailExist = await User.findOne({email}).select('password')

        // console.log(emailExist)

        if(!emailExist){
            return res.status(400).json({ message: "Email does not exist" })
        }

        // check if password is correct
        const validPassword =  bcrypt.compareSync(password, emailExist.password)

        if(!validPassword){
            return res.status(400).json({ message: "Invalid password" })
        }
        
        const token = createToken({
            id: emailExist._id,
            name: emailExist.name,
            email: emailExist.email
            })

        // set header token
        req.headers.authorization = token



        

        res.status(200).json( {message: "Logged in successfully", data: emailExist, auth: token} );

    }catch(err){
        console.log(err)
        res.status(400).json({ err });
    }

}

// logout users
exports.logoutUser = async (req, res, next) => {

    try{

        // make the token  in the header expire
        const expiredToken = jwt.sign({id: null}, secret, {
            expiresIn: 1
        });
        req.headers.authorization = expiredToken 



        res.status(200).json( {message: "Logged out successfully"} );

    }catch(err){
        console.log(err)
        res.status(400).json({ err });
    }

}

// get user profile
exports.getUserProfile = async (req, res, next) => {
    try{
        // console.log(req.user)
        const user = req.user


        res.status(200).json( {message: "User profile fetched successfully", data: user} );
    }catch(error){
        console.log(error)
        res.status(400).json({ error });
    }
}

// update password
exports.updatePassword = async (req, res, next) => {

    try{
        // get user
        const { error } = validatePasswordUpdate(req.body);

        if(error){
            return res.status(400).json({ message: error.details[0].message })
        }
        const user = await User.findById(req.user.id).select('+password')

        // check if current password is correct
        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password)

        if(!isMatch){
            return res.status(400).json({ message: "Invalid password" })
        }

        // hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt)

        user.password = hashedPassword 

        await user.save()

        res.status(200).json( {message: "Password updated successfully"} );



    }catch(error){
        console.log(error)
        res.status(400).json( error );
    }
}

// update profile    
exports.updateProfile = async (req, res, next) => {

    try{

        const { error } = validateProfileUpdate(req.body);

        if(error){
            return res.status(400).json({ message: error.details[0].message })
        }

        const { name, email } = req.body

        // get user
        const user = await User.findById(req.user.id)

        user.name = name || user.name
        user.email = email || user.email
        user.role = role || user.role

        await user.save()

        res.status(200).json( {message: "Profile updated successfully", data: user} );

    }catch(error){  
        console.log(error)
        res.status(400).json({ error });
    }
}


// get user details
exports.getUserDetails = async (req, res, next) => {

    try{

        const { error } = validateGetUserDetails(req.params);

        if(error){
            return res.status(400).json({ message: error.details[0].message })
        }

        const { id } = req.params

        // find user
        const user = await User.findById(id)

        if(!user){
            return res.status(400).json({ message: "User not found" })
        }

        res.status(200).json( {message: "User details", data: user} );

    }catch(error){
        console.log(error)
        res.status(400).json({ error });
    }

}


// delete user
exports.deleteUser = async (req, res, next) => {

    try{

        const { error } = validateGetUserDetails(req.params);

        if(error){
            return res.status(400).json({ message: error.details[0].message })
        }

        const { id } = req.params

        // find user
        const user = await User.findById(id);

        if(!user){
            return res.status(400).json({ message: "User not found" })
        }

        // remove user

        User.findByIdAndDelete(id)

        res.status(200).json( {message: "User deleted successfully"} );

    }catch(error){
        console.log(error)
        res.status(400).json({ error });
    }

}


exports.allUsers = async (req, res, next) => {

    try{
        const users = await User.find()

        res.json({data: users})
        // res.status(200).json( {message: "All users", data: users} );

    }catch(error){
        console.log(error)
        res.status(400).json({ error });
    }

}
