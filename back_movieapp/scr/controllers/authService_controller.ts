import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../DataBase';
import { QueryResult } from 'pg';

const app = express();
app.use(express.json());

// // Simulación de una base de datos de usuarios
// const usersDatabase = [
//   {
//     id: 1,
//     username: 'usuario1',
//     password: 'contraseña123'
//   },
//   {
//     id: 2,
//     username: 'usuario2',
//     password: 'qwerty'
//   }
// ];

// interface User {
//   id: number;
//   username: string;
//   password: string;
// }

// function findUserByUsername(username: string): User | undefined {
//   return usersDatabase.find(user => user.username === username);
// }

// async function verifyCredentials(username: string, password: string): Promise<any | undefined> {

//   const responseUser: QueryResult = await pool.query('SELECT * FROM users where email = $1 and password = $3 and status=$2', [username, 1, password]);
//   if ((responseUser.rowCount ?? 0) === 0) {
//     return undefined;
//   }
//   return responseUser.rows[0];
//   // const user = findUserByUsername(username);

//   // if (user && user.password === password) {
//   //   return user;
//   // } else {
//   //   return undefined;
//   // }
// }


async function verifyCredentials(username: string, password: string): Promise<any | undefined> {
  try {
    console.log("verif:")
    console.log(username +" "+ password)
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




// Función para generar un token JWT
function generateJWTToken(user: any): string {
  const payload = {
    userId: user.id,
    username: user.email
  };
  console.log("aqui");
  console.log(user);
  console.log(payload);
  const secretKey = 'pepeGrilloPerroBonito123456789111111jacquelineoura';
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
    console.log(req.body)
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

// export const loginEndpoint = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { userName, password } = req.body;
//     console.log("authenticatedUser:")
//     console.log(userName)
//     const authenticatedUser =  await verifyCredentials(userName, password);
//     console.log(authenticatedUser)
//     if (authenticatedUser) {
//       // Usuario autenticado, generamos un token JWT
//       const authToken = generateJWTToken(authenticatedUser);
     
//      //----------
//       try {
//         const decoded = jwt.decode(authToken);
//         console.log(decoded); // Muestra el payload decodificado
//       } catch (error) {
//         console.error('Error al decodificar el token:', error);
//       }
// //---------
//       return res.json({ token: authToken });

//     } else {
//       return res.status(401).json({ error: 'Credenciales incorrectas' });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: 'Error al autenticar usuario' });
//   }
// };






