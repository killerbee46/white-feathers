import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("whitefeat_wf_new","white_feat_dev","P@ssw00rd",{
host     : 'localhost',
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