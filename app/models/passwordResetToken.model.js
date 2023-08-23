module.exports = (sequelize, Sequelize) => {
  const PasswordResetToken = sequelize.define("password_reset_tokens", {
    token: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    expiration: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });

  return PasswordResetToken;
};