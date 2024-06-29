import { pool } from "../database.js";
import InternalError from "../errors/handleError.js";
import { Resend } from 'resend';

const resend = new Resend('re_A4778mB6_6a1zTPvkXgh6eWjs3fR4JzgL');

export const createIncidencia = async (req, res) => {
  try {
    const { CF_FECHA_HORA_REGISTRO, CT_TITULO, CT_DESCRIPCION_INCIDENCIA, CT_LUGAR, CT_CEDULA } = req.body;

    const CT_ID_INCIDENCIA = await generateUniqueCode(); // Espera la generación del código único

    const [result] = await pool.query(
      'CALL createIncidencia(?,?,?,?,?,?)',
      [CT_ID_INCIDENCIA, CF_FECHA_HORA_REGISTRO, CT_TITULO, CT_DESCRIPCION_INCIDENCIA, CT_LUGAR, CT_CEDULA]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "La incidencia ya existe" });
    }

    // Enviar correo electrónico de notificación
    try {
      
    } catch (emailError) {
      console.error('Error al enviar el correo electrónico:', emailError);
    }

    // Aquí retornamos los datos de la incidencia creada junto con el mensaje de éxito
    return res.status(201).json({
      message: CT_ID_INCIDENCIA
    });
  } catch (error) {
    return InternalError(res, error);
  }
}

export const asignarIncidencia = async (req, res) => {
  try {
    const { CT_CEDULA, CT_ID_INCIDENCIA, CN_PRIORIDAD, CN_RIESGO, CN_AFECTACION, CN_ID_ESTADO, CD_COSTO, CN_DURACION_GESTION, CN_CATEGORIA, Correo } = req.body;

    const [result] = await pool.query(
      'CALL asignarIncidencia(?,?,?,?,?,?,?,?,?)',
      [CT_CEDULA, CT_ID_INCIDENCIA, CN_PRIORIDAD, CN_RIESGO, CN_AFECTACION, CN_ID_ESTADO, CD_COSTO, CN_DURACION_GESTION, CN_CATEGORIA]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Error" });
    } 
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: `${Correo}`,
      subject: 'Asignacion de incidencia',
        html: `<p>Hola se te ha asignado la incidencia ${CT_ID_INCIDENCIA} con un tiempo de ${CN_DURACION_GESTION}!</p>`
    });

    // Aquí retornamos los datos de la incidencia creada junto con el mensaje de éxito
    return res.status(201).json({
      message: "Incidencia asignada correctamente al usuario " + CT_CEDULA
    });
  } catch (error) {
    return InternalError(res, error);
  }
}

export const CambioEstado = async (req, res) => {
  try {
    const { CT_ID_INCIDENCIA, CN_ID_ESTADO, CT_CEDULA } = req.query;
    console.log(CT_ID_INCIDENCIA, CN_ID_ESTADO, CT_CEDULA);
    const [rows] = await pool.query(
      'CALL CambioEstado(?,?,?)',
      [CT_ID_INCIDENCIA, CN_ID_ESTADO, CT_CEDULA]
    );

    if (rows[0].length <= 0) {
      return res.status(404).json({ message: "No hay Diagnosticos para esta incidencia" })
    }
    return res.json(rows[0])
  } catch (error) {
    return error;
  }
}

export const GetSupervisionData = async (req, res) => {
  try {
    const { CT_ID_INCIDENCIA } = req.query;

    const [rows] = await pool.query(
      'CALL GetIncidenciaYUsuarioSupervision(?)',
      [CT_ID_INCIDENCIA]
    );

    if (rows[0].length <= 0) {
      return res.status(404).json({ message: "No hay datos para esta incidencia" })
    }
    return res.json({
      incidencia: rows[0],
      usuarios: rows[1]
    });
  } catch (error) {
    return error;
  }
}

export const GetIncidenciasTerminadas = async (req, res) => {
  try {
    const { } = req.query;

    const [rows] = await pool.query(
      'CALL GetIncidenciasTerminadas()',
      []
    );

    if (rows[0].length <= 0) {
      return res.status(404).json({ message: 0 })
    }
    return res.json(rows[0])
  } catch (error) {
    return error;
  }
}

export const getIncidencia = async (req, res) => {
  try {
    const { CT_ID_INCIDENCIA } = req.query;

    const [rows] = await pool.query(
      'CALL GetIncidencia(?)',
      [CT_ID_INCIDENCIA]
    );

    if (rows[0].length <= 0) {
      return res.status(404).json({ message: 0 })
    }
    return res.json(rows[0])
  } catch (error) {
    return error;
  }
}

export const getIncidencias = async (req, res) => {
  try {
    const { } = req.query;

    const [rows] = await pool.query(
      'CALL GetIncidencias()',
      []
    );

    if (rows[0].length <= 0) {
      return res.status(404).json({ message: 0 })
    }
    return res.json(rows[0])
  } catch (error) {
    return error;
  }
}

export const getIncidenciaAsignada = async (req, res) => {
  try {
    const { CT_CEDULA } = req.query;

    const [rows] = await pool.query(
      'CALL GetIncidenciasAsignadas(?)',
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

export const generateUniqueCode = async () => {
  const year = new Date().getFullYear();
  const prefijo = `${year}-`;

  // Encuentra el último registro y obtiene su código
  let ultimoRegistro = null;
  try {
    const [rows] = await pool.query("CALL GetUltimaIncidencia();");
    if (rows[0].length <= 0) {
      return `${prefijo}000000`;
    }
    ultimoRegistro = rows[0][0];
    console.log(ultimoRegistro);
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener el último registro");
  }

  let nuevoCodigo;
  if (!ultimoRegistro) {
    nuevoCodigo = `${prefijo}000001`;
  } else if (ultimoRegistro.CT_ID_INCIDENCIA) {
    const ultimoCodigo = ultimoRegistro.CT_ID_INCIDENCIA;
    const ultimoNumero = parseInt(ultimoCodigo.split('-')[1], 10);
    const nuevoNumero = (ultimoNumero + 1).toString().padStart(6, '0');
    nuevoCodigo = `${prefijo}${nuevoNumero}`;
  } else {
    nuevoCodigo = `${prefijo}000001`;
  }
  return nuevoCodigo;
};
