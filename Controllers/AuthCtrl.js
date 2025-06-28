import { pool } from "../Config/dbConnect.js";
import bcrypt from "bcrypt";
import { generatetoken } from "../Config/jwt.js";
import multer from "multer";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'; // Ensure jwt is imported
const upload = multer();

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (results.length === 0) return res.status(401).json({ message: "Invalid email" });

    const user = results[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Mark user as logged in
    await pool.query("UPDATE users SET is_logged = true WHERE id = ?", [user.id]);

    const token = await generatetoken(user.id);
    return res.status(200).json(
      {
         message: "Login success", 
         token , user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          is_logged: user.is_logged 
        }
      }
        );
  } catch (err) {
    return res.status(500).json({ message: "Internal error", error: err.message });
  }
};

// SIGNUP
export const signUp = async (req, res) => {
  const { email, password, name, role, phone } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password, name, role, phone) VALUES (?, ?, ?, ?, ?)', [
      email,
      hashedPassword,
      name,
      role,
      phone,
    ]);

    res.status(201).json({ msg: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error during signup', error });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token not provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 🔄 Await pool query
    const [result] = await pool.query("UPDATE users SET is_logged = false WHERE id = ?", [userId]);

    return res.status(200).json({ message: 'Logout successful' });

  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token', error: err.message });
  }
};

// GET ALL USERS 
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, email, name, role, phone FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching users', error });
  }
};

// GET USER BY ID 
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [users] = await pool.query('SELECT id, email, name, role, phone FROM users WHERE id = ?', [id]);
    if (users.length === 0) return res.status(404).json({ msg: 'User not found' });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching user', error });
  }
};
