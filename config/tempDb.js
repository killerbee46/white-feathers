import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('whitefeat_wf_new', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
}); 

export const tempDbConnect = () => {
    sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to sql database');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
}