
import { pool } from "../Config/dbConnect.js";

export const addDealership = async (req, res) => {
    try {
        console.log('Received body:', req.body);
        const { id, name, code, location, address, city, state, contactPerson, email, phone, status,country } = req.body; // Review data from the request body
        const mysqlQuery = `INSERT INTO  dealership (id, name,code,location,address,city,state,contactPerson,email,phone,status, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.query(mysqlQuery, [id, name, code, location, address, city, state, contactPerson, email, phone, status, country]);
        const [rows] = await pool.query(`SELECT * FROM dealership WHERE id = ?`, [result.insertId]);
        return res.status(201).json({
            message: "Dealership submitted successfully",
            data: rows[0], // or i
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// UPDATE INVENTORY
export const updateDealership = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const [result] = await pool.query(
            `UPDATE dealership SET name=?, code=?, location=?, address=?, city=?, state=?, contactPerson=?, email=?, phone=?, status=?, country=? WHERE id=?`,
            [
                data.name, data.code, data.location, data.address, data.city, data.state, data.contactPerson, data.email, data.phone, data.status, data.country, id
            ]
        );
        if (result.affectedRows === 0) return res.status(404).json({ msg: 'Dealership not found' });
        res.json({ msg: 'Dealership updated successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Error updating dealership', error });
    }
};

// DELETE INVENTORY
export const DeleteDealership = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM dealership WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ msg: 'dealerships not found' });
        res.json({ msg: 'dealerships deleted' });
    } catch (error) {
        res.status(500).json({ msg: 'Error deleting dealerships', error });
    }
};


// GET ALL USERS 
export const getDealership = async (req, res) => {
    try {
        const [dealerships] = await pool.query('SELECT * FROM dealership');
        res.json(dealerships);
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching dealerships', error });
    }
};

// GET USER BY ID 
export const getDealershipByid = async (req, res) => {
    const { id } = req.params;
    try {
        const [dealerships] = await pool.query('SELECT * FROM dealership WHERE id = ?', [id]);
        if (dealerships.length === 0) return res.status(404).json({ msg: 'dealership not found' });
        res.json(dealerships[0]);
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching dealerships', error });
    }
};
