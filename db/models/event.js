import moment from 'moment';

export default function(sequelize, DataTypes) {
  const EventModel = sequelize.define('events', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
  }, {});

  EventModel.associate = function(models) {
    models.EventModel
  };

  // - model helper methods

  EventModel.findForLatestDate = async () => {
    const latestEvent = await EventModel.findOne({
      limit: 1,
      order: [['createdAt', 'DESC']],
      raw: true
    });
    latestEvent.createdAt = moment(latestEvent.createdAt);
    return latestEvent;
  }

  return EventModel;
};
