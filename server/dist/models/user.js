"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
exports.UserFactory = UserFactory;
const sequelize_1 = require("sequelize");
const bcrypt = require("bcrypt"); // ✅ Changed from "bcrypt" to "bcryptjs"
class User extends sequelize_1.Model {
    // Hash the password before saving the user
    async setPassword(password) {
        const saltRounds = 10;
        this.password = bcrypt.hashSync(password, saltRounds); // ✅ Use `hashSync` instead of `await`
    }
}
exports.User = User;
function UserFactory(sequelize) {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: "users",
        sequelize,
        hooks: {
            beforeCreate: async (user) => {
                await user.setPassword(user.password);
            },
            beforeUpdate: async (user) => {
                if (user.changed("password")) {
                    await user.setPassword(user.password);
                }
            },
        },
    });
    return User;
}
