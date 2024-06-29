import { pool } from "../database.js";

export const GetReportes = async (req, res) => {
    try {
      const [rows] = await pool.query(
        'CALL GetReportes()'
      );
  
      if (rows[0].length <= 0) {
        return res.status(404).json({ message: 0 })
      }
      return res.json(rows[0])
    } catch (error) {
      return error;
    }
  } 

  
  export const createBitacora = async (req, res) => {
    try {
      const { CT_CEDULA, CT_ID_INCIDENCIA, CN_AFECTACION, CB_REQUIERE_COMPRA, CN_TIEMPO_ESTIMADO, tipo} = req.body;
      let CT_REFERENCIA = await generateReference(CT_CEDULA, CT_ID_INCIDENCIA, CN_AFECTACION, CB_REQUIERE_COMPRA, CN_TIEMPO_ESTIMADO, tipo)
        console.log(CT_REFERENCIA);
        console.log(CT_CEDULA, CT_ID_INCIDENCIA, CN_AFECTACION, CB_REQUIERE_COMPRA, CN_TIEMPO_ESTIMADO, tipo);
      const [result] = await pool.query(
        'CALL createBitacoraGeneral(?,?,?)',
        [CT_CEDULA, 1, CT_REFERENCIA]);
  
      if (result.affectedRows === 0) {
        return res.status(403).json({ message: "The diagnostico already exists" });
      }
      return res.status(201).json({ message: "bitacora created successfully" });
    } catch (error) {
      return InternalError(res, error);
    }
  }

  export const generateReference = async (CT_CEDULA, CT_ID_INCIDENCIA, CN_AFECTACION, CB_REQUIERE_COMPRA, CN_TIEMPO_ESTIMADO, tipo) => {
    let salida;
    if (tipo == 1) {
        salida = "Registro: " + CT_ID_INCIDENCIA +"-"+ CT_CEDULA
    }else if (tipo == 2) {
        salida = "Asignacion: " + CT_ID_INCIDENCIA +"-"+ CT_CEDULA
    }else if (tipo == 3) {
        CB_REQUIERE_COMPRA = CB_REQUIERE_COMPRA == false ? "No" : "Sí";
        CN_AFECTACION = CN_AFECTACION === 0 ? "Bajo" : (CN_AFECTACION === 1 ? "Medio" : (CN_AFECTACION === 2 ? "Alto" : CN_AFECTACION));
        salida = "Diagnostico:" +" "+ CT_ID_INCIDENCIA +" "+CN_AFECTACION +" "+  CB_REQUIERE_COMPRA +" "+ CN_TIEMPO_ESTIMADO
    }
    return salida;
  };
  