const User = require('../models/UserModel')
const api_key = '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'
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

///////////////////////////////////////  Register /////////////////////////////////////
exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck)
            return res.json({ msg: "Username already used", status: false });
        const emailCheck = await User.findOne({ email });
        if (emailCheck)
            return res.json({ msg: "Email already used", status: false });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        });
        delete user.password;
        let token = JWT.sign({ id: user.user_id, user: user }, api_key)
        console.log(user)
        return res.json({ status: true, user, token });
    } catch (ex) {
        next(ex);
    }
}
////////////////////////////////////////LOG IN //////////////////////////////////////
exports.Login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        let user = await User.findOne({ username } )
        if (!user) {
            return res.status(404).json({
                msg: 'Wrong Username or Email or Password '
            })
        }
        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(404).json({
                msg: 'Wrong Username or Email or Password '
            })
        }
        const token = JWT.sign({ id: user.user_id }, api_key)
        res.status(200).json({
            token: token,
            msg: 'Welcome Back ....!!!!!'
        })

    } catch (error) {
        res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }
}
//////////////////////////////////////show All Users//////////////////////////////////////

exports.getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "username",
        "avatarImage",
        "_id",
      ]);
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  };
///////////////////////////////////////log out ////////////////////////////
exports.logOut = (req, res, next) => {
    try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      onlineUsers.delete(req.params.id);
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  };
  ///////////////////////////////set profile picture////////////////////
  exports.setAvatar = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const avatarImage = req.body.image;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isAvatarImageSet: true,
          avatarImage,
        },
        { new: true }
      );
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } catch (ex) {
      next(ex);
    }
  };
  