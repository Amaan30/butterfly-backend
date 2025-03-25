"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173', // Development
        'https://gleaming-strudel-07579f.netlify.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1); // Exit if missing critical config
}
const MONGO_URI = process.env.MONGODB_URI;
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));
app.use('/api/users', userRoutes_1.default);
app.get('/', (_req, res) => {
    res.send('Welcome to the server!');
});
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(process.cwd(), 'dist')));
//   app.get('*', (req: Request, res: Response) => {
//     res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
//   });
// }
app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
