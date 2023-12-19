import { Pool } from 'pg';

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'bocala12',
    database: 'tdl2023_db',
    port: 5432
});