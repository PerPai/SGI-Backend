import { pool } from "../database.js";
import InternalError from "../errors/handleError.js";


  export const aniadirimagen = async (req, res) => {
    try {
      const { CT_ID_INCIDENCIA, CT_RUTA_IMAGEN, CB_TIPO} = req.body;
  console.log(  CT_ID_INCIDENCIA );
      const [result] = await pool.query(
        'CALL añadirImagen(?,?,?)',
        [ CT_ID_INCIDENCIA, CT_RUTA_IMAGEN, CB_TIPO]);
  
      if (result.affectedRows === 0) {
        return res.status(403).json({ message: "La Imagen existe" });
      }
      return res.status(201).json({ message: "IMG created successfully" });
    } catch (error) {
      return InternalError(res, error);
    }
  }
  