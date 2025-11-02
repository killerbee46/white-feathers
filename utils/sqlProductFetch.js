export const sqlProductFetch = (columns="") =>{

const sql = "SELECT  p.id_pack as id,"+columns+"IF(p.image <> '', p.image, (SELECT ps.s_path FROM package_slider ps WHERE ps.id_pack = p.id_pack LIMIT 1)) AS image,(pr.rate/11.664 * p.weight + p.dc_rate * p.dc_qty + IF(p.mk_pp, p.mk_pp, p.mk_gm * p.weight) ) AS dynamic_price FROM package p JOIN package_metal pr ON p.pmt_id = pr.pmt_id"
return sql

}