import { pool } from "../Config/dbConnect.js";
export const getDashboardSummary = async (req, res) => {
    try {
        const [dealership] = await pool.query("SELECT COUNT(*) AS total_dealership FROM dealership");
        const [orders] = await pool.query("SELECT COUNT(*) AS total_orders FROM orders");
        const [users] = await pool.query("SELECT COUNT(*) AS active_users FROM users WHERE status = 1");
        const [Pendingorders] = await pool.query("SELECT COUNT(*) AS pending_orders FROM orders WHERE status = 'Pending';");
        const [inventory] = await pool.query("SELECT COUNT(*) AS total_inventory FROM inventory");
        const [recentOrders] = await pool.query("SELECT id, dealership, order_date, status FROM orders  ORDER BY order_date DESC LIMIT 5");
        const [monthlySales] = await pool.query("SELECT MONTH(order_date) AS month, COUNT(*) AS count FROM orders GROUP BY MONTH(order_date)");
        const [recentActivities] = await pool.query("SELECT action_type, action_details, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 5");
        const [orderStatus] = await pool.query("SELECT status, COUNT(*) AS count FROM orders GROUP BY status");
        // Map month number to name
        const monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlySalesChart = Array.from({ length: 12 }, (_, i) => ({
            month: monthMap[i],
            count: 0
        }));
        monthlySales.forEach(ms => {
            monthlySalesChart[ms.month - 1].count = ms.count;
        });
        res.status(200).json({
            success: true,
            data: {
                total_dealership: dealership[0].total_dealership,
                total_orders: orders[0].total_orders,
                active_users: users[0].active_users,
                Pending_orders: Pendingorders[0].pending_orders,
                total_inventory: inventory[0].total_inventory || 0,
                recent_Orders: recentOrders,
                order_status: orderStatus,
                monthly_sales: monthlySalesChart,
                recent_activities: recentActivities
            }
        });
    } catch (error) {
        console.error("❌ Dashboard summary error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getfinaceDashboard = async (req, res) => {
    try {
        const [orders] = await pool.query("SELECT COUNT(*) AS total_orders FROM orders");
        const [ordersYes] = await pool.query(
            "SELECT COUNT(*) AS finance_order_status_yes FROM orders WHERE finance_order_status = 'Yes'"
        );
        const [ordersNo] = await pool.query(
            "SELECT COUNT(*) AS finance_order_status_no FROM orders WHERE finance_order_status = 'No'"
        );
        const [latestOrders] = await pool.query(
            "SELECT * FROM orders ORDER BY order_date DESC LIMIT 5"
        );
        res.status(200).json({
            success: true,
            data: {
                total_orders: orders[0].total_orders,
                finance_order_status_yes: ordersYes[0].finance_order_status_yes,
                finance_order_status_no: ordersNo[0].finance_order_status_no,
                latest_orders: latestOrders,
            },
        });
    } catch (error) {
        console.error("❌ Dashboard summary error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



export const getsalespersonDashboard = async (req, res) => {
  const { country } = req.params;
  if (!country) {
    return res.status(400).json({ success: false, message: "Country is required" });
  }
  try {
    // Orders Count
    const [orders] = await pool.query(
      `SELECT COUNT(*) AS total_orders FROM orders WHERE country = ?`, [country]
    );

    // Dealership Count (users with role = 'dealership')
    const [dealerships] = await pool.query(
      `SELECT COUNT(*) AS total_dealerships  FROM dealership WHERE country = ?`, [country]
    );
      const [inventorys] = await pool.query(
      `SELECT COUNT(*) AS total_inventorys  FROM inventory WHERE country = ?`, [country]
    );





    // Inventory Summary
    // const [inventory] = await pool.query(
    //   `SELECT SourceName, BRAND,
    //     FROM inventory 
    //     WHERE country = ?`, [country]
    // );

    res.status(200).json({
      success: true,
      data: {
        country,
        total_orders: orders[0].total_orders,
        total_inventorys:inventorys[0].total_inventorys,
        total_dealerships: dealerships[0].total_dealerships,
        // inventory,
      },
    });

  } catch (error) {
    console.error("❌ Country Dashboard Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


