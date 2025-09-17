// const sendToken = (user, statusCode, res, redirectUrl = null) => {
//     console.log(user, statusCode, "sendToken called");
//     const token = user.getJWTToken();
  
//     const options = {
//       expires: new Date(
//         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//       ),
//       httpOnly: true,
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//       secure: process.env.NODE_ENV === 'production',
//     };
  
//     if (redirectUrl) {
//       res.status(statusCode).cookie('token', token, options).redirect(redirectUrl);
//     } else {
//       res.status(statusCode).cookie('token', token, options).json({
//         success: true,
//         user,
//         // token,
//       });
//     }
//   };
  
//   module.exports = sendToken;

const sendToken = (user, statusCode, res, redirectUrl = null) => {
  const token = user.getJWTToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: 'None', // TODO: Try setting it to lax and see if it works ?
    secure: process.env.NODE_ENV === 'production',
  };

  if (redirectUrl) {
    res
        .status(statusCode)
        .cookie('token', token, options)
        .redirect(redirectUrl);
  } else {
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
          success: true,
          user,
        });
  }
};

module.exports = sendToken;