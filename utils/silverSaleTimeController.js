import { sequelize } from "../config/tempDb.js"

export const startSale = async() => {
    const query = "update package set visible = 1 where id_pack = 2292"
    sequelize.query(query)
}
export const stopSale = () => {
const query = "update package set visible = 0 where id_pack = 2292"
    sequelize.query(query)
}