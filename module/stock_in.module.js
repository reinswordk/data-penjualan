const config = require(`${__config_dir}/app.config.json`);
const {debug} = config;
const helper = require(`${__class_dir}/helper.class.js`);
const mysql = new(require(`${__class_dir}/mariadb.class.js`))(config.db);
const __handler = require(__basedir + '/class/fileHandling.class.js');
const handler = new __handler(__basedir + '/public/image/parts/');

class _stock_in{
	deleteStockIn(id){
		const sql = {
			query: `DELETE FROM d_stock_in WHERE id = ?`,
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
					console.error('deleteProduct Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	updateStockIn(data){
		const sql = {
			query: `UPDATE d_stock_in SET date_in = ?, qty = ?, product_id = ? WHERE id = ?`,
			params: [data.date_in, data.qty, data.product_id, data.id]
		}

		return mysql.query(sql.query, sql.params)
			.then(data => {
				return {
					status: true,
					data
				}
			}).catch(error => {
				if(debug){
					console.error('updateStockIn Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	addStockIn(data){
		const sql = {
			query: `INSERT INTO d_stock_in(id, date_in, qty, product_id) VALUES (?, ?, ?, ?)`,
			params: [data.id, data.date_in, data.qty, data.product_id]
		}

		return mysql.query(sql.query, sql.params)
			.then(data => {
				return {
					status: true,
					data
				}
			}).catch(error => {
				if(debug){
					console.error('addStockIn Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	getDetailStockIn(id){
		const sql = {
			query: `
                SELECT
                    d_stock_in.id,
                    d_stock_in.date_in,
                    d_stock_in.qty,
                    d_stock_in.product_id
                FROM d_stock_in 
                WHERE id = ?`,
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
					console.error("getDetailStockIn Error:", error);
				}

				return {
					status: false,
					error
				}
			})
	}

	listStockIn(){
		const sql = {
			query: `
				SELECT
                    d_stock_in.id,
                    d_stock_in.date_in,
                    d_stock_in.qty,
                    d_stock_in.product_id
				FROM d_stock_in 
				WHERE 1`,
			params: [],
		};

		return mysql.query(sql.query, sql.params)
			.then(data => {
				return {
					status: true,
					data: data
				};
			})
			.catch(error => {
				if (error.code == "EMPTY_RESULT") {
					return {
						status: false,
						error: "Data masih kosong!"
					}
				}

				if(debug){
					console.error('Stock_in list Error:', error);
				}

				return {
					status: false,
					error,
				};
			});
	};
}

module.exports = new _stock_in();