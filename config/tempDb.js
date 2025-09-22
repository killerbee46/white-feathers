import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("whitefeat_wf_new","killerbee_local","P@ssw00rd",{
host     : '3.110.62.209',
dialect : 'mysql'
}); 

export const tempDbConnect = async() => {
    await sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to sql database');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
}