import { Router } from "express";
import { createUser, login, getUsers, GetTecnicos} from "../controllers/users.js";
import { generateUniqueCode, createIncidencia, getIncidencia, asignarIncidencia, getIncidenciaAsignada, GetSupervisionData, getIncidencias, CambioEstado, GetIncidenciasTerminadas} from "../controllers/incidencia.js";
import { createDiagnostico, GetDiagnosticos } from "../controllers/diagnostico.js";
import { aniadirimagen } from "../controllers/imagenes.js";
import { GetRolesAsignados } from "../controllers/rol.js";
import { GetReportes, createBitacora } from "../controllers/reportes.js";

const routerSGI=Router();

// Añadir una nueva ruta para manejar la carga de imágenes

routerSGI.get('/users', getUsers);
routerSGI.get('/users/tecnicos', GetTecnicos);
routerSGI.post('/users', createUser);
routerSGI.post('/login', login);

routerSGI.get('/rol', GetRolesAsignados);

routerSGI.post('/incidencia', createIncidencia);
routerSGI.post('/incidencia/asignar', asignarIncidencia);
routerSGI.get('/incidencia', getIncidencia);
routerSGI.get('/incidencias', getIncidencias);
routerSGI.get('/incidencias/terminadas', GetIncidenciasTerminadas);
routerSGI.get('/asignada', getIncidenciaAsignada);
routerSGI.post('/incidencia/cambio', CambioEstado);
routerSGI.get('/supervision/data', GetSupervisionData);

routerSGI.post('/diagnostico', createDiagnostico);
routerSGI.post('/imagen', aniadirimagen);
routerSGI.get('/diagnostico', GetDiagnosticos);

routerSGI.get('/reportes', GetReportes);
routerSGI.post('/bitacora', createBitacora);
export default routerSGI;