import { pool } from "../database.js";

export const GetRolesAsignados = async (req, res) => {
    try {
      const { CT_CEDULA } = req.query;
  
      const [rows] = await pool.query(
        'CALL GetRolesAsignados(?)',
        [CT_CEDULA]
      );
  
      if (rows[0].length <= 0) {
        return res.status(404).json({ message: 0 })
      }
      return res.json(rows[0])
    } catch (error) {
      return error;
    }
  } 