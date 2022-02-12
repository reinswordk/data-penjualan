const config = require(`${__config_dir}/app.config.json`);
const {debug} = config;
const helper = require(`${__class_dir}/helper.class.js`);
const mysql = new(require(`${__class_dir}/mariadb.class.js`))(config.db);
const __handler = require(__basedir + '/class/fileHandling.class.js');
const handler = new __handler(__basedir + '/public/image/parts/');

class _stock_out{
	deleteStockOut(id){
		const sql = {
			query: `DELETE FROM d_stock_out WHERE id = ?`,
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
					console.error('deleteStockOut Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	updateStockOut(data){
		const sql = {
			query: `UPDATE d_stock_out SET date_out = ?, qty = ?, product_id = ? WHERE id = ?`,
			params: [data.date_out, data.qty, data.product_id, data.id]
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

	addStockOut(data){
		const sql = {
			query: `INSERT INTO d_stock_out(id, date_out, qty, product_id) VALUES (?, ?, ?, ?)`,
			params: [data.id, data.date_out, data.qty, data.product_id]
		}

		return mysql.query(sql.query, sql.params)
			.then(data => {
				return {
					status: true,
					data
				}
			}).catch(error => {
				if(debug){
					console.error('addStockOut Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	getDetailStockOut(id){
		const sql = {
			query: `
                SELECT
                    d_stock_out.id,
                    d_stock_out.date_out,
                    d_stock_out.qty,
                    d_stock_out.product_id
                FROM d_stock_out 
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
					console.error("getDetailStockOut Error:", error);
				}

				return {
					status: false,
					error
				}
			})
	}

	listStockOut(){
		const sql = {
			query: `
				SELECT
                    d_stock_out.id,
                    d_stock_out.date_out,
                    d_stock_out.qty,
                    d_stock_out.product_id
				FROM d_stock_out
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
					console.error('Stock_out list Error:', error);
				}

				return {
					status: false,
					error,
				};
			});
	};
}

module.exports = new _stock_out();