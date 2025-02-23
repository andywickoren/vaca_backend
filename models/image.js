module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("Image", {
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_best: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Image.associate = (models) => {
    Image.belongsTo(models.State, { foreignKey: "state_id" });
  };

  return Image;
};
