const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to GiaPha API' });
});

// Route test DB (trả về thời gian hiện tại từ SQL Server)
app.get('/api/test', async (req, res) => {
    try {
      const users = await User.findAll()
      res.json({ message: 'Kết nối DB thành công', data: users })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi kết nối DB', error: err.message })
    }
  })

// Kết nối Sequelize + test model
const sequelize = require('./config/sequelize.config'); // 👈 sửa lại đường dẫn
const { User } = require('./models');

sequelize.authenticate()
  .then(() => {
    console.log('✅ Kết nối database thành công.');

    // Test truy vấn
    return User.findAll();
  })
  .then(users => {
    console.log('📦 Users:', users);
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối hoặc truy vấn:', err);
  });

// Sử dụng router
const routes = require('./routes');
app.use('/api', routes); // Ví dụ: /api/auth/login

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
