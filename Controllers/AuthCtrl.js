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
export const CreateUser = async (req, res) => {
  const { email, password, name, role, phone, dealership_id, status, country  } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (email, password, name, role, phone,  dealership_id, status, country) VALUES (?,?, ?, ?, ?, ?, ?, ?)', [
      email,
      hashedPassword,
      name,
      role,
      phone,
      dealership_id || null, // or set default null
      status || 1, // set default active (1)
      country
    ]);

    res.status(201).json({ msg: 'User created successfully',
      data:result[0]
     });
  } catch (error) {
    res.status(500).json({ msg: 'Error during signup', error });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, name, role, phone, dealership_id, status, country } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await pool.query('UPDATE users SET email = ?, name = ?, role = ?, phone = ?, dealership_id = ?, status = ?, country = ? WHERE id = ?', [
      email,
      name,
      role,
      phone,
      dealership_id || null,
      status || 1,
      id,
      country

    ]);

    res.status(200).json({ msg: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error updating user', error });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error deleting user', error });
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

    const [users] = await pool.query(`SELECT u.id, u.email, u.name, u.role, u.phone, u.created_at, u.dealership_id, d.name AS dealership_name, u.status, u.country
      FROM users u
      LEFT JOIN dealership d ON u.dealership_id = d.id
    `);
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching users', error });
  }
};



// GET USER BY ID 
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [users] = await pool.query('SELECT id, email, name, role, phone, country FROM users WHERE id = ?', [id]);
    if (users.length === 0) return res.status(404).json({ msg: 'User not found' });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching user', error });
  }
};

export const assigndelership = async (req, res) => {
  const { id } = req.params
  const { dealership_id } = req.body;
  try {


    const [result] = await pool.query("UPDATE users SET dealership_id = ? ,  dealership_assigned_date = NOW() WHERE id = ? ", [dealership_id, id]);
    if (result.affectedRows == 0) {
      return res.status(400).json({ message: "users not found" });
    }
    res.status(200).json({
      message: "Dealership assigned successfully",
      userId: id,
      dealershipId: dealership_id
    })
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({message: "Internal sever error"})

  }
}

export const getAssignedUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT 
        id, 
        name, 
        email, 
        role, 
        dealership_id, 
        country
        DATE_FORMAT(dealership_assigned_date, '%Y-%m-%d') as assigned_date 
      FROM users 
      WHERE dealership_id IS NOT NULL
    `);

    res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    console.error("❌ Error fetching assigned users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


