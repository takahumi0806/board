module.exports = {
  doGetUser: (req, res, error) => {
    console.log(req.session);
    res.render('index')
    // res.render('index', {
    //   errorMessage: error,
    // });
  },
  // doSigninUser: (req, res) => {
  //   const name = req.body.userName;
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     const errors_array = errors.array();
  //     res.render ('index', {
  //       name: name,
  //       errorMessage: errors_array,
  //     });
  //   } else {
  //     res.render('signin', {
  //       name: name,
  //     });
  //   }
  // },
};