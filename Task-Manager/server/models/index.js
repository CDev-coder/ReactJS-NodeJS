const { sequelize } = require("../database/config");
const { DataTypes } = require("sequelize");

// User Model
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password_hash",
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

// Task Model
const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "in-progress", "completed"),
      defaultValue: "pending",
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "medium",
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      field: "due_date",
      allowNull: true,
    },
  },
  {
    tableName: "tasks",
    timestamps: true,
  },
);

// Tag Model (optional for now)
const Tag = sequelize.define(
  "Tag",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: "#1976d2",
    },
  },
  {
    tableName: "tags",
    timestamps: true,
  },
);

// Define relationships
User.hasMany(Task, { foreignKey: "userId" });
Task.belongsTo(User, { foreignKey: "userId" });

Task.belongsToMany(Tag, { through: "task_tags", foreignKey: "task_id" });
Tag.belongsToMany(Task, { through: "task_tags", foreignKey: "tag_id" });

// Export models
module.exports = {
  User,
  Task,
  Tag,
  sequelize,
};
