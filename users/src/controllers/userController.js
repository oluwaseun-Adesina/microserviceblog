const User = require('../model/User')
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const secret = process.env.APP_SECRET;
const maxAge =  30 * 60 * 60 * 60;
const createToken = (id) =>{
    return jwt.sign({id}, secret, {
        expiresIn: maxAge
    });
}

getResetPasswordToken = () =>{
    // generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    return resetToken;
}

// register users
exports.registerUser = async (req, res, next) => {

    try{
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

         // log user automatically after registration
        //  console.log(token)
    
        // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).json( {message: "Registered successfully", data: user, auth: token} );

       

    }catch(err){
        console.log(err)
        res.status(400).json({ err });
    }

}

// login users
exports.loginUser = async (req, res, next) => {

    try{
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
        // console.log(token)
        
        // console.log(emailExist)

        // set header token
        req.headers.authorization = token



        
 
        // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json( {message: "Logged in successfully", data: emailExist, auth: token} );

        // console.log(req.headers)

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




        // res.cookie('jwt', '', { maxAge: 1})

        // req.headers.authorization = null

        // console.log(req.headers)



        res.status(200).json( {message: "Logged out successfully"} );

    }catch(err){
        console.log(err)
        res.status(400).json({ err });
    }

}

// forgot password
exports.forgotPassword = async (req, res, next) => {

    try{

        const { email } = req.body

        // check if email already exists
        const emailExist = await UserfindOne({email})

        if(!emailExist){
            return res.status(400).json({ message: "Email does not exist" })
        }

        // get reset token
        const resetToken = emailExist.getResetPasswordToken()

        await emailExist.save()

        // create reset url

        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`

        // const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

        // try{

        //     await sendEmail({
        //         email: emailExist.email,
        //         subject: 'Password reset token',
        //         message
        //     })

        //     res.status(200).json({ success: true, data: 'Email sent' })

        // }
        // catch(err){
        //     console.log(err)
        //     emailExist.resetPasswordToken = undefined
        //     emailExist.resetPasswordExpire = undefined

        //     await emailExist.save()

        //     return next(new ErrorResponse('Email could not be sent', 500))
        // }

    }catch(err){
        console.log(err)
        res.status(400).json({ err });
    }

}

// reset password
exports.resetPassword = async (req, res, next) => {
    console.log(req.params.resetToken)
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
        res.status(400).json({ error });
    }
}

// update profile    
exports.updateProfile = async (req, res, next) => {

    try{
        const { name, email } = req.body

        // get user
        const user = await User.findById(req.user.id)

        user.name = name || user.name
        user.email = email || user.email

        await user.save()

        res.status(200).json( {message: "Profile updated successfully", data: user} );

    }catch(error){  
        console.log(error)
        res.status(400).json({ error });
    }
}

// get all users
exports.allUsers = async (req, res, next) => {

    try{
        const users = await User.find()

        res.status(200).json( {message: "All users", data: users} );

    }catch(error){
        console.log(error)
        res.status(400).json({ error });
    }

}

// get user details
exports.getUserDetails = async (req, res, next) => {

    try{
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

// update user
exports.updateUser = async (req, res, next) => {

    try{
        const { id } = req.params

        // find user
        const user = await User.findById(id)

        if(!user){
            return res.status(400).json({ message: "User not found" })
        }

        const { name, email, role } = req.body

        user.name = name || user.name
        user.email = email || user.email
        user.role = role || user.role

        await user.save()

        res.status(200).json( {message: "User updated successfully", data: user} );

    }catch(error){
        console.log(error)
        res.status(400).json({ error });
    }

}

// delete user
exports.deleteUser = async (req, res, next) => {

    try{
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

module.exports.createPost = async (req, res, next) =>{
    try{
        const user = User.findById({_id: req.user._id})

        if(!user){
            return res.status(404).json({ message: "User not Found"})
        }

        const newPost = {

        }

        user.posts.push(newPost);

        await user.save();

        res.status(201).json({ message: "Post Created", post: newPost})

    }catch(error){
        next(error)
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

// // function to recieve just created post from the post service and add it to the user
// module.exports.addPost = async (req, res, next) =>{
//     try{
//         const { title, description, createdby, createAt, _id } = req.body

//         const user = await User.findById(createdby)

//         if(!user){
//             return res.status(404).json({ message: "User not Found"})
//         }

//         user.posts.push({ title, description, createdby, createAt, _id });

//         await user.save();

//         console.log(user)

//         res.status(201).json({ message: "Post Created", post: post})

//     }catch(error){
//         console.log(error)
//         res.json({ error })
//         next(error)
//     }
// }

// module.exports.updatePost = async (req, res, next) =>{
//     try{
//         const { title, description, createdby, _id } = req.body

//         const user = await User.findById(createdby)

//         if(!user){
//             return res.status(404).json({ message: "User not Found"})
//         }

//         const post = user.posts.find(post => post._id === _id)

//         if(!post){
//             return res.status(404).json({ message: "Post not Found"})
//         }

//         post.title = title || post.title
//         post.description = description || post.description

//         await user.save();

//         res.status(201).json({ message: "Post Updated", post: post})
//     }catch(error){
//         console.log(error)
//         res.status(500).json({ error })
//     }

// }

// // delete post
// module.exports.deletePost = async (req, res, next) =>{
//     try{

//         const id = req.params.id

//         const user = await User.findById(req.user._id)

//         if(!user){
//             return res.status(404).json({ message: "User not Found"})
//         }

//         const post = user.posts.find(post => post._id === id)

//         if(!post){
//             return res.status(404).json({ message: "Post not Found"})
//         }

//         user.posts.pull({ _id: id })

//         await user.save();

//         res.status(201).json({ message: "Post Deleted", post: post})


//     }catch(error){
//         next(error)
//     }

// }

// registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserProfile, updatePassword, updateProfile, allUsers, getUserDetails, updateUser, deleteUser

// add user post

// {
//     _id: new ObjectId("645a01f99a732d0d74971f07"),
//     name: 'Test User',
//     email: 'test@gmail.com',
//     password: '$2a$10$d7uNxbZ8eqFmAIEOibciheakN82lr6xP.EL6fnYEs6TeZaqvxnet.',
//     role: 'user',
//     avatar: 'https://res.cloudinary.com/dj7k0lade/image/upload/v1623344783/avatars/avatar_qkxq8c.png',
//     createdAt: 2023-05-09T08:19:05.834Z,
//     posts: [],
//     __v: 0
//   }