module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define("State", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  State.associate = (models) => {
    State.hasMany(models.Image, { foreignKey: "state_id" });
  };

  return State;
};
