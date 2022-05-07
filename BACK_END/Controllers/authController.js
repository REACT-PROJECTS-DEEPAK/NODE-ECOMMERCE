const User = require("../Models/user");
const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncError = require("../MiddleWares/catchAsyncError");
const sendToken = require("../Utils/jwtToken");
const sendEmail = require("../Utils/sendEmail");
const crypto = require("crypto");
const user = require("../Models/user");
const order = require("../Models/order");

const { cloudinary } = require("../Utils/cloudinary");

// Register a user /api/v1/register

exports.registerUser = catchAsyncError(async (req, res, next) => {
  console.log("In register user");
  const file = req.body;
  console.log(file);
  const result = await cloudinary.uploader.upload(req.body.avatar, {
    folder: "images_folder",
    width: 150,
    crop: "scale",
  });
  console.log(result);
  const { name, email, password } = req.body;
  // console.log("name field" + name);
  const user = await User.create({
    name: name,
    email: email,
    password: password,
    avatar: {
      // public_id:'Avatars/Albert-Einstein_i2les6',
      // url:'https://res.cloudinary.com/dzpltdic8/image/upload/v1648619089/Amrith-BuyIt-Images/Avatars/Albert-Einstein_i2les6.webp'
      public_id: result.public_id,
      url: result.secure_url,
    },
  });
  const token = user.getJwtToken();
  res.status(201).json({
    success: true,
    token: token,
    // user:user
  });
  // above code commented as we modified our code to send in cookie so refractoring the change.
  sendToken(user, 200, res);
});

// Login user /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("please enter email or password", 400));
  }

  // Finding user in database.
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or password", 401));
  }

  // Check if password correct or not
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Password", 401));
  }

  // const token = user.getJwtToken();

  // res.status(200).json({
  //     success:true,
  //     token:token
  // })
  // above code commented as we modified our code to send in cookie so refractoring the change.
  // console.log(user);
  sendToken(user, 200, res);
});

// logout of user ===>/api/v1/logout
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// forgot password route =>/api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not Exist for this email", 404));
  }

  // get reset token
  const resetToken = user.getResetPasswordToken();
  // const resetToken = resettokenval;
  await user.save({ validateBeforSave: false }); // we are telling to mongo db dont validate the user before saving.
  // await user.save({resetPasswordToken:completeString.split('_')[1],resetPasswordExpire:completeString.split('_')[2]});
  // console.log(user)
  // create reset password url.
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\n if you have not requested this email then igonre it.`;

  try {
    // code for send email
    await sendEmail({
      email: user.email,
      subject: "BuyIT Password Recovery email.",
      message: message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.ResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // once we set values in mongo db again we have to save the user.
    await user.save({ validateBeforSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// reset password route =>/api/v1/password/reset:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // we should get token from url , hash the URL.
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // we have to fetch the user with resetpassword token and expire time greater than current time and date.
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password Reset Token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password Doesnot Match", 400));
  }
  // if password match setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // now send new token
  sendToken(user, 200, res);
});

// get currently logged in user details ==> api/v1/me
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user: user,
  });
});

// update change password ==> api/v1/password/update

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  // check previous user password.
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }
  user.password = req.body.password;

  await user.save();
  sendToken(user, 200, res);
});

// UPDATE USER PROFILE ==>api/v1/me/update

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  // right now we dont have functionality of couldinary so we are not updating picture. this is main part

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Admin Routes
// to get all users => /api.v1/admin/users
exports.allUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users: users,
  });
});

// get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User doesnot found by id:${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user: user,
  });
});
