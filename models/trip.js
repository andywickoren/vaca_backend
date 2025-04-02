module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define("Trip", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    park: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Trip.associate = (models) => {
    Trip.hasMany(models.Image, { foreignKey: "trip_id" });
  };

  return Trip;
};
