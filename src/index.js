const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require('cors');
const db = require('./db/config');
const bodyParser = require('body-parser');
const path = require('path');
const { authentication } = require('./middleware/auth');
const userRoutes = require('./users/users.route');
const employeeRoutes = require('./employees/employees.route');
const attendenceRoutes = require('./attendences/attendences.route');
const { seed, tables } = require('./db/database');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
async function initializeApp() {
    try {
        console.log('🔄 Initializing database...');
        await tables();
        await seed();
        console.log('✅ Database initialized successfully');

        app.get('/', (req, res) => {
            res.send('Welcome to Dexa HR Backend');
        });

        app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

        app.use('/users', userRoutes);
        app.use(authentication);
        app.use('/employees', employeeRoutes);
        app.use('/attendences', attendenceRoutes);

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        process.exit(1);
    }
}

initializeApp();

module.exports = app;