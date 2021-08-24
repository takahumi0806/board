const { check } = require('express-validator');

module.exports = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('名前を入力して下さい'),
  check('email')
    .isEmail()
    .withMessage('メールアドレスを入力して下さい'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('パスワードは6文字以上です'),
    check('password')
    .custom((value, { req }) => {
      if(req.body.password !== req.body.confirmPassword) {
        throw new Error('パスワード（確認）と一致しません。');
      }
      return true;
    })
]