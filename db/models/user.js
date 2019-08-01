import bcrypt from 'bcrypt';
import {
  emailAlreadyInUseError,
  createError,
} from 'src/services/error_manager';

const HASH_ROUNDS = 10;

export default function(sequelize, DataTypes) {
  const UserModel = sequelize.define('users', {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID
    },
    firstName: {
      type: DataTypes.TEXT
    },
    lastName: {
      type: DataTypes.TEXT
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    phone: {
      type: DataTypes.TEXT,
      validate: {
        phoneFormat(value) {
          const reg = /^\d{3}(-)\d{3}(-)\d{4}$/;
          if (value && !reg.test(value)) throw new Error('Invalid phone number format');
        }
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {});

  UserModel.associate = function(models) {
    // associations can be defined here
  };

  UserModel.createStd = async ({ user }) => {
    const { email } = user;
    const dupeUser = await UserModel.findOne({ where: { email }});
    if (dupeUser) throw(emailAlreadyInUseError());
    const modelSkeleton = UserModel.build(user);
    await modelSkeleton.validate();

    const hash = await bcrypt.hash(user.password, HASH_ROUNDS);
    user.password = hash;
    return UserModel.create(user);
  };

  return UserModel;
};
