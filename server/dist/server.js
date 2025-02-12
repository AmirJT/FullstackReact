"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const forceDatabaseRefresh = false;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // ✅ Import CORS
const index_js_1 = __importDefault(require("./routes/index.js"));
const index_js_2 = require("./models/index.js");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// ✅ Enable CORS for frontend requests
app.use((req, _, next) => {
    console.log("🛠 CORS Request from:", req.headers.origin);
    next();
});
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://localhost:3000"], // ✅ Allow both ports
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
// Serves static files in the entire client's dist folder
app.use(express_1.default.static('../client/dist'));
app.use(express_1.default.json());
app.use(index_js_1.default);
index_js_2.sequelize.sync({ force: forceDatabaseRefresh }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
});
