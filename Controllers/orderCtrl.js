import { pool } from "../Config/dbConnect.js";

export const addOrder = async (req, res) => {
  try {
    console.log('Received body:', req.body);
    const parseDate = (value) => {
      return value === "" || value === undefined || value === null ? null : value;
    };  
    const {
     id, admin_id, user_id, dealership_id,	product,	qty,	status,
  	order_date,	delivery,	total,	source,
    	stock_no,	manu_no,	manu_no2,	invoice_no,	payment,pay_status,	pay_terms	,vin_no	,engine_no	,key_no,
      	bl_no,	ship_date,	brand,	ocn_spec,	model,	country,	year,	ext_color,	int_color,	tbd3,	order_month,	prod_est,	ship_est,	
        est_arr	,shp_dte,	arr_est,	arr_date,	ship_ind, finance_order_status	
    } = req.body;
    const mysqlQuery = `
      INSERT INTO orders (
        id, admin_id, user_id, dealership_id,	product,	qty,	status,
  	order_date,	delivery,	total,	source,
    	stock_no,	manu_no,	manu_no2,	invoice_no,	payment,pay_status,	pay_terms	,vin_no	,engine_no	,key_no,
      	bl_no,	ship_date,	brand,	ocn_spec,	model,	country,	year,	ext_color,	int_color,	tbd3,	order_month,	prod_est,	ship_est,	
        est_arr	,shp_dte,	arr_est,	arr_date,	ship_ind	,finance_order_status	
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ? 
      )
    `;
    const values = [
      id, admin_id, user_id, dealership_id,	product,	qty,	status,
  	order_date,	delivery,	total,	source,
    	stock_no,	manu_no,	manu_no2,	invoice_no,	payment,pay_status,	pay_terms	,vin_no	,engine_no	,key_no,
      	bl_no,	ship_date,	brand,	ocn_spec,	model,	country,	year,	ext_color,	int_color,	tbd3,	order_month,	prod_est,	ship_est,	
        est_arr	,shp_dte,	arr_est,	arr_date,	ship_ind	,finance_order_status	
    ];
    console.log("Number of placeholders:", mysqlQuery.match(/\?/g).length); 
    console.log("Number of values:", values.length);                        
    const [result] = await pool.query(mysqlQuery, values);
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [result.insertId]);
    return res.status(201).json({
      message: "Order submitted successfully",
      data: rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const RecentOrder = async (req, res) => {
  try {
    const [orders] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateOrderStatusdelershipID = async (req, res) => {
  try {
    const { dealership_id } = req.params; // Order ID from URL
    const { status } = req.body; // New status

    if (!dealership_id || !status) {
      return res.status(400).json({
        message: "Order ID and new status are required.",
      });
    }

    const updateQuery = `UPDATE orders SET status = ? WHERE dealership_id = ?`;
    const [result] = await pool.query(updateQuery, [status, dealership_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Order not found or already up-to-date.",
      });
    }

    const [updatedOrder] = await pool.query(`SELECT * FROM orders WHERE dealership_id = ?`, [dealership_id]);

    return res.status(200).json({
      message: "Order status updated successfully.",
      data: updatedOrder[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const updateOrderStatusByID = async (req, res) => {
  try {
    const { id } = req.params; // Order ID from URL
    const { finance_order_status } = req.body; // New status

    if (!id || !finance_order_status	) {
      return res.status(400).json({
        message: "Order ID and new finance_order_status	 are required.",
      });
    }

    const updateQuery = `UPDATE orders SET finance_order_status	 = ? WHERE id = ?`;
    const [result] = await pool.query(updateQuery, [finance_order_status	, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Order not found or already up-to-date.",
      });
    }

    const [updatedOrder] = await pool.query(`SELECT * FROM orders WHERE id = ?`, [id]);

    return res.status(200).json({
      message: "Order status updated successfully.",
      data: updatedOrder[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`SELECT * FROM orders WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      data: rows[0],
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


// export const getAllOrder = async (req, res) => {
//   try {
//     const [orders] = await pool.query(`
//       SELECT 
//         o.*, 
//         d.name 
//       FROM orders o
//       LEFT JOIN dealership d ON o.dealership_id = d.id
//     `);

//     res.status(200).json({ success: true, data: orders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };



export const getAllOrder = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT 
        o.*, 
        d.name AS dealership_name,
        COALESCE(u1.name, u2.name) AS customer
      FROM orders o
      LEFT JOIN dealership d ON o.dealership_id = d.id
      LEFT JOIN users u1 ON o.user_id = u1.id
      LEFT JOIN users u2 ON o.admin_id = u2.id
    `);

    // NO NEED to map again. Query already gives "customer".
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};






export const getOrderByCountry = async (req, res) => {
   const { country } = req.params;
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE COUNTRY = ?', [country]);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ msg: 'orders not found' });
        res.json({ msg: 'orders deleted' });
    } catch (error) {
        res.status(500).json({ msg: 'Error deleting orders', error });
    }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params; // ID from URL
    const {
      admin_id, user_id, dealership_id, product, qty, status,
      order_date, delivery, total, source,
      stock_no, manu_no, manu_no2, invoice_no, payment, pay_status, pay_terms,
      vin_no, engine_no, key_no, bl_no, ship_date, brand, ocn_spec, model,
      country, year, ext_color, int_color, tbd3, order_month, prod_est, ship_est,
      est_arr, shp_dte, arr_est, arr_date, ship_ind,finance_order_status	
    } = req.body;

    const updateQuery = `
      UPDATE orders SET
        admin_id = ?, user_id = ?, dealership_id = ?, product = ?, qty = ?, status = ?,
        order_date = ?, delivery = ?, total = ?, source = ?,
        stock_no = ?, manu_no = ?, manu_no2 = ?, invoice_no = ?, payment = ?, pay_status = ?, pay_terms = ?,
        vin_no = ?, engine_no = ?, key_no = ?, bl_no = ?, ship_date = ?, brand = ?, ocn_spec = ?, model = ?,
        country = ?, year = ?, ext_color = ?, int_color = ?, tbd3 = ?, order_month = ?, prod_est = ?, ship_est = ?,
        est_arr = ?, shp_dte = ?, arr_est = ?, arr_date = ?, ship_ind = ?, finance_order_status	= ?
      WHERE id = ?
    `;

    const values = [
      admin_id, user_id, dealership_id, product, qty, status,
      order_date, delivery, total, source,
      stock_no, manu_no, manu_no2, invoice_no, payment, pay_status, pay_terms,
      vin_no, engine_no, key_no, bl_no, ship_date, brand, ocn_spec, model,
      country, year, ext_color, int_color, tbd3, order_month, prod_est, ship_est,
      est_arr, shp_dte, arr_est, arr_date, ship_ind, finance_order_status	,
      id // for WHERE condition
    ];

    const [result] = await pool.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found or no changes made." });
    }

    const [updated] = await pool.query(`SELECT * FROM orders WHERE id = ?`, [id]);

    return res.status(200).json({
      message: "Order updated successfully",
      data: updated[0],
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};












