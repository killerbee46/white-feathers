import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
dotenv.config();
import models from '../models';
// // import { environment } from '.'
const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = path.dirname(__filename);
export const sequelize = new Sequelize({
    database: process.env.DATABASE_NAME,
    dialect: 'mysql',
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: 'localhost',
    port: 3306,
    models: models,
    modelMatch: (filename, member) => {
        return (filename.substring(0, filename.indexOf('.model')).toLowerCase() ===
            member.toLowerCase());
    }
});
