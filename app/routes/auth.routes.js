const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post(
    "/api/auth/signup_as_seller",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup_as_seller
  );

  app.post("/api/auth/emailVerification", controller.verifyEmail);
  app.post("/api/auth/signin", controller.signin);
  app.post('/api/auth/resetPassword', controller.resetPassword);
  app.post('/api/auth/resetPasswordNewPasswort', controller.resetPasswordToNewPassword);
  app.get('/api/auth/checkResetTokenValidity/:token', controller.checkResetTokenValidity);
  app.post('/api/auth/changePasswordForUser', controller.changePassword);
};
