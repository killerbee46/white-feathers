export const sqlProductFetch = (columns="") =>{

const sql = "SELECT p.id_pack as id,"+ columns +"image.s_path,(IF(p.pmt_id <= 9, pr.rate/11.664 * p.weight, pr.rate * p.weight) + p.dc_rate * p.dc_qty + IF(p.mk_pp, p.mk_pp, p.mk_gm * p.weight) ) AS dynamic_price, p.offer*p.dc_rate*p.dc_qty/100 as discount FROM package_slider image INNER JOIN package p ON image.id_pack=p.id_pack JOIN `whitefeat_wf`.`package_metal` pr ON p.pmt_id = pr.pmt_id "

return sql

}