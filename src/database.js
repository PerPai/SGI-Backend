import { createPool } from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config()

//The object for connect the database will take the enviroment variables 
export const pool = createPool({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    port:process.env.PORT,
    database:process.env.DATABASE, 
})