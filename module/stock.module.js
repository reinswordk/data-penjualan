const config = require(`${__config_dir}/app.config.json`);
const {debug} = config;
const helper = require(`${__class_dir}/helper.class.js`);
const mysql = new(require(`${__class_dir}/mariadb.class.js`))(config.db);
const __handler = require(__basedir + '/class/fileHandling.class.js');
const handler = new __handler(__basedir + '/public/image/parts/');

class _stock{
	deleteStock(id){
		const sql = {
			query: `DELETE FROM d_stock WHERE id = ?`,
			params: [id]
		}

		return mysql.query(sql.query, sql.params)
			.then(data => {
				return {
					status: true,
					data
				}
			}).catch(error => {
				if (debug) {
					console.error('deleteStock Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	updateStock(data){
		const sql = {
			query: `UPDATE d_stock SET total_qty = ? WHERE id = ?`,
			params: [data.total_qty, data.id]
		}

		return mysql.query(sql.query, sql.params)
			.then(data => {
				return {
					status: true,
					data
				}
			}).catch(error => {
				if (error.code == "ER_DUP_ENTRY") {
					return {
						status: false,
						error: "Data sudah ada!"
					}	
				}

				if(debug){
					console.error('updateStock Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	addStock(data){
		const sql = {
			query: `INSERT INTO d_stock(id, product_id, total_qty) VALUES (?, ?, ?)`,
			params: [data.id, data.product_id, data.total_qty]
		}

		return mysql.query(sql.query, sql.params)
			.then(data => {
				return {
					status: true,
					data
				}
			}).catch(error => {
				if (error.code == "ER_DUP_ENTRY") {
					return {
						status: false,
						error: "Data sudah ada!"
					}	
				}

				if(debug){
					console.error('addStock Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	listStock(options = {}){
		const { id } = options
		const sql = {
				query: `
                    SELECT
						stock.id,
						stock.product_id,
						stock.total_qty
					FROM d_stock stock
					WHERE 1`,
				params: [],
			};

		return mysql.query(sql.query, sql.params)
			.then(async data => {
				let tmp = [];

				for (let key in data) {
					tmp.push({
						id: data[key].id,
						name: data[key].name
					})
				}

				return {
					status: true,
					data
				};
			})
			.catch(error => {
				if (id && error.code == "EMPTY_RESULT") {
					return {
						status: false,
						error: "Data tidak ditemukan!"
					}
				}

				if (error.code == "EMPTY_RESULT") {
					return {
						status: false,
						error: "Data masih kosong!"
					}
				}

				if(debug){
					console.error('Stock list Error:', error);
				}

				return {
					status: false,
					error,
				};
			});
	};
	getDetailStock(id){
		const sql = {
			query: 
			`SELECT
				stock.id,
				stock.product_id,
				stock.total_qty
			FROM d_stock AS stock
			WHERE stock.id = ?`,
			params: [id] 
		}

		return mysql.query(sql.query, sql.params)
			.then(data => {
				return {
					status: true, 
					data
				}
			}).catch(error => {
				if(debug){
					console.log("getDetailStock error");
				}
				return {
					status: false,
					error
				} 
			})
	}
}

module.exports = new _stock();
