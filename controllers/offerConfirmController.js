import { sequelize } from "../config/tempDb.js";

export const congratulateUsers = async (req, res) => {
    try {
        const query = "SELECT distinct cno,name,address, p_amount, email from cart_book WHERE email = 'offer-nosepin' and cno is not null order by cb_id limit 13"
        const [data] = await sequelize.query(query)
        data.push({cno:'9861325293',name:"Sugam Bhandari"})
        data.forEach((dat) => {
            const sparrowUrl = new URL(`https://api.sparrowsms.com/v2/sms/?from=InfoAlert&to=${dat?.cno}&text=Congratulations ${dat?.name} ji, for being one of 12 first users to place order of the 14K Stoned Nose Pin. Please feel free to check out other offers provided on our site too https://whitefeathersjewellery.com . Thank you, &token=v2_Nd8UndHle6pYCSWXvLjkjOChhNd.GIYi`);
            fetch(sparrowUrl)
        });

        res.status(200).send({
            status: 'success',
            data: "Congratulated all offer winners",
            winners: data
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting users cart",
        });
    }
};

export const consoleUsers = async (req, res) => {
    try {
        const query = "SELECT distinct cno,(select name from cart_book cb_temp where cb_temp.cno = cb.cno limit 1) as name from cart_book cb WHERE email = 'offer-nosepin' and cno is not null order by cb_id limit 12,100"
        const [data] = await sequelize.query(query)
        data.push({cno:'9861325293',name:"Sugam Bhandari"})
        data.forEach((dat) => {
            const sparrowUrl = new URL(`https://api.sparrowsms.com/v2/sms/?from=InfoAlert&to=${dat?.cno}&text=Thank you ${dat?.name} ji, for your patience and determination to try and get the offer on 14K Stoned Nose Pin. Unfortunately, the offer was only for first 12 orders and you weren't one of them. Please feel free to check out other offers provided on our site https://whitefeathersjewellery.com . Thank you, &token=v2_Nd8UndHle6pYCSWXvLjkjOChhNd.GIYi`);
            fetch(sparrowUrl)
        });

        res.status(200).send({
            status: 'success',
            data: "Consoled all offer non-winners",
            winners: data
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting users cart",
        });
    }
};