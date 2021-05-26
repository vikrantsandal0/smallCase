/* This is the Sequelize model for portfolio table */
const portfolioModel = (database, type) => {
  return database.define("portfolio", {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: type.UUID,
      allowNull: false
    },
    ticker_symbol: {
      type: type.STRING,
      allowNull: false
    },
    average_price: {
      type: type.DECIMAL(10, 2),
      allowNull: false
    },
    current_quantity: {
      type: type.INTEGER,
      allowNull: false
    },
    old_quantity: {
      type: type.INTEGER,
      allowNull: false
    },
    old_average: {
      type: type.DECIMAL(10, 2),
      allowNull: false
    },
    createdAt: {
      field: "created_on",
      type: type.DATE,
    },
    updatedAt: {
      field: "modified_on",
      type: type.DATE,
    }
  }, {
    freezeTableName: true,
    timestamps: true
  });
};

module.exports = portfolioModel;