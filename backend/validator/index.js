exports.userSignupValidator = (req, res, next) => {
  req.check('name', 'Le nom est requis').notEmpty();
  req
    .check('email', 'L\'email doit contenir entre 3 et 32 ​​caractères')
    .matches(/.+\@.+\..+/)
    .withMessage('L\'email doit contenir @')
    .isLength({
      min: 4,
      max: 32,
    });
  req.check('password', 'Le mot de passe est requis ').notEmpty();
  req
    .check('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractère')
    .matches(/\d/)
    .withMessage('Le mot de passe doit contenir un chiffre');
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
