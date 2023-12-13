import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../DataBase';
import { QueryResult } from 'pg';

declare global {
  namespace Express {
    interface Request {
      usuario?: globalUserData; // Puedes definir un tipo específico para los datos del usuario si es necesario
    }
  }
}
interface globalUserData {
  userId:number,
  username:string,
}
const app = express();
app.use(express.json());
const secretKey = 'pepeGrilloPerroBonito123456789111111jacquelineoura';

async function verifyCredentials(username: string, password: string): Promise<any | undefined> {
  try {
    const responseUser: QueryResult = await pool.query('SELECT * FROM users WHERE email = $1 AND status = $2 AND password = $3', [username, 1, password]);

    if ((responseUser.rowCount ?? 0) === 0) {
      return undefined;
    }

    return responseUser.rows[0];
  } catch (error) {
    console.error('Error al verificar credenciales:', error);
    throw error; // Propaga el error para que pueda ser manejado externamente si es necesario
  }
}

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensaje: 'Token inválido' });
    }
    req.usuario = decoded as globalUserData;
    console.log("USUARIO LOGEADO ->",req.usuario)
    next();
  });
}


// Función para generar un token JWT
function generateJWTToken(user: any): string {
  const payload = {
    userId: user.id,
    username: user.email
  };
  const options = {
    expiresIn: '1h' // El token expirará en 1 hora
  };

  return jwt.sign(payload, secretKey, options);
}


// import { Request, Response } from 'express';
// import { verifyCredentials, generateJWTToken } from './authService'; // Importa las funciones necesarias

export const loginEndpoint = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userName, password } = req.body;

    const authenticatedUser = await verifyCredentials(userName, password);

    if (authenticatedUser) {
      // Usuario autenticado, generamos un token JWT
      const authToken = generateJWTToken(authenticatedUser);

      //*********************** */
      //console.log(res.json({ token: authToken }));
      return res.json({ token: authToken });

    } else {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al autenticar usuario' });
  }
};
