import { pool } from "../database.js";
import InternalError from "../errors/handleError.js";

export const getUsers = async (req, res) => {
    try {
  
        const [rows] = await pool.query("CALL GetUsuarios();", [
  
        ])
        if (rows[0].length <= 0) {
            return res.status(404).json({ message: 0 })
        }
        return res.json(rows[0])
    } catch (error) {
        return error;
    }
  }
export const GetTecnicos = async (req, res) => {
    try {
  
        const [rows] = await pool.query("CALL GetTecnicos();", [
  
        ])
        if (rows[0].length <= 0) {
            return res.status(404).json({ message: 0 })
        }
        return res.json(rows[0])
    } catch (error) {
        return error;
    }
  }



  export const createUser = async (req, res) => {
    try {
      const { CT_NOMBRE, CT_APELLIDO_UNO, CT_APELLIDO_DOS, CN_TELEFONO, CT_CEDULA, CT_CORREO, CT_PUESTO, CN_DEPARTAMENTO, CB_ESTADO, CT_CONTRASENA, CN_ROL} = req.body;
  
      const saltRounds = 5;

      const [result] = await pool.query(
        'CALL createUser(?,?,?,?,?,?,?,?,?,?,?)',
        [CT_NOMBRE, CT_APELLIDO_UNO, CT_APELLIDO_DOS, CN_TELEFONO, CT_CEDULA, CT_CORREO, CT_PUESTO, CN_DEPARTAMENTO, CB_ESTADO, CT_CONTRASENA, CN_ROL]
      );
  
      if (result.affectedRows === 0) {
        return res.status(403).json({ message: "The user already exists" });
      }
      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      return InternalError(res, error);
    }
  };
  

export const login = async (req, res) => {
  try {
    const { _emailAddress, _password } = req.body;
    const [data] = await pool.query("CALL login(?)", [_emailAddress]);

    let comparacion = false;
    if (_password === data[0][0].CT_CONTRASENA) {
        comparacion = true;
    }
    console.log(data[0][0]);
    if (comparacion) {
      return res.status(200).json(data);
    } else {
      return res.status(403).json({ message: 0 });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 2 });
  }
};

export const changePreference = async (req, res) => {
  try {
    const { user_id, category_id } = req.query;

    const [rows] = await pool.query("CALL update_preference(?, ?);", [
      user_id,
      category_id,
    ]);

    if (!rows) {
      return res.status(404).json({ message: 0 });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

