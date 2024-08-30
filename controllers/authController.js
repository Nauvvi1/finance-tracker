// controllers/authController.js
import User from '../models/User.js'; // Модель пользователя
import bcrypt from 'bcryptjs'; // Для хеширования пароля
import jwt from 'jsonwebtoken'; // Для создания JWT

// Регистрация пользователя
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Проверяем, существует ли пользователь
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 12);

        // Создаем нового пользователя
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Генерируем JWT токен
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: newUser });
    } catch (error) {
        console.error('Ошибка регистрации:', error); // Логируем ошибку
        res.status(500).json({ message: 'Ошибка регистрации' });
    }
};

// Авторизация пользователя
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Проверяем, существует ли пользователь
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Неправильный ник пользователя или пароль' });
        }

        // Проверяем правильность пароля
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Неправильный ник пользователя или пароль' });
        }

        // Генерируем JWT токен
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user });
    } catch (error) {
        console.error('Ошибка авторизации:', error); // Логируем ошибку
        res.status(500).json({ message: 'Ошибка авторизации' });
    }
};
