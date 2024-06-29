import { pool } from "../database.js";
import InternalError from "../errors/handleError.js";


  export const createDiagnostico = async (req, res) => {
    try {
      const { CF_FECHA_HORA_DIAGNOSTICO, CT_DIAGNOSTICO , CN_TIEMPO_ESTIMADO, CT_OBSERVACIONES, CB_REQUIERE_COMPRA, CT_ID_INCIDENCIA, CT_CEDULA} = req.body;
  
      const [result] = await pool.query(
        'CALL createDiagnostico(?,?,?,?,?,?,?)',
        [CF_FECHA_HORA_DIAGNOSTICO, CT_DIAGNOSTICO , CN_TIEMPO_ESTIMADO, CT_OBSERVACIONES, CB_REQUIERE_COMPRA, CT_ID_INCIDENCIA, CT_CEDULA]);
  
      if (result.affectedRows === 0) {
        return res.status(403).json({ message: "The diagnostico already exists" });
      }
      return res.status(201).json({ message: "diagnostico created successfully" });
    } catch (error) {
      return InternalError(res, error);
    }
  }
  
  export const GetDiagnosticos = async (req, res) => {
    try {
      const { CT_ID_INCIDENCIA } = req.query;
  
      const [rows] = await pool.query(
        'CALL GetDiagnosticos(?)',
        [CT_ID_INCIDENCIA]
      );
  
      if (rows[0].length <= 0) {
        return res.status(404).json({ message: "No hay Diagnosticos para esta incidencia" })
      }
      return res.json(rows[0])
    } catch (error) {
      return error;
    }
  }  


  