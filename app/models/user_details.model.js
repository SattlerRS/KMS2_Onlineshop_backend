module.exports = (sequelize, Sequelize) => {
    const UserDetails = sequelize.define('userdetails', {
        firstName: {
            type: Sequelize.STRING,
        },
        lastName: {
            type: Sequelize.STRING,
        },
        street: {
            type: Sequelize.STRING,
        },
        city: {
            type: Sequelize.STRING,
        },
        postalCode: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        birthdate: {
            type: Sequelize.DATE,
        },
        phoneNumber: {
            type: Sequelize.STRING,
        },
        image: {
            type: Sequelize.STRING,
        }
    });

    // Exportiere das Modell
    return UserDetails;
}
