/* This is the Sequelize model for expertises table */
const tradesModel = (database, type) => {
  return database.define('trades', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    security_uuid: {
      type: type.UUID,
      allowNull: false,
    },
    trade_price: {
      type: type.DECIMAL(10, 2),
      allowNull: false
    },
    trade_type: {
      type: type.STRING,
      allowNull: false
    },
    trade_quantity: {
      type: type.INTEGER,
      allowNull: false
    },
    new_average_price: {
      type: type.DECIMAL(10, 2),
      allowNull: false
    },
    new_quantity: {
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
    is_deleted: {
      type: type.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      field: "created_on",
      type: type.DATE,
    },
    updatedAt: {
      field: "modified_on",
      type: type.DATE,
    }
  },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );
};

module.exports = tradesModel;