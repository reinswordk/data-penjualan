const config = require(`${__config_dir}/app.config.json`);
const {debug} = config;
const helper = require(`${__class_dir}/helper.class.js`);
const mysql = new(require(`${__class_dir}/mariadb.class.js`))(config.db);
const __handler = require(__basedir + '/class/fileHandling.class.js');
const handler = new __handler(__basedir + '/public/image/parts/');

class _sale{
	deleteSale(id){
		const sql = {
			query: `DELETE FROM d_sale WHERE id = ?`,
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
					console.error('deleteSale Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	updateSale(data){
		const sql = {
			query: `UPDATE d_sale SET product_id = ?, customer_id = ?, qty = ?, date = ? WHERE id = ?`,
			params: [data.product_id, data.customer_id, data.qty, data.date, data.id]
		}

		return mysql.query(sql.query, sql.params)
			.then(data => {
				return {
					status: true,
					data
				}
			}).catch(error => {
				if(debug){
					console.error('updateSale Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	addSale(data){
		const sql = {
			query: `INSERT INTO d_sale(id, product_id, customer_id, qty, date) VALUES (?, ?, ?, ?, ?)`,
			params: [data.id, data.product_id, data.customer_id, data.qty, data.date]
		}

		return mysql.query(sql.query, sql.params)
			.then(data => {
				return {
					status: true,
					data
				}
			}).catch(error => {
				if(debug){
					console.error('addSale Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	getDetailSale(id){
		const sql = {
			query: `
                SELECT
                    id,
                    product_id,
                    customer_id,
                    qty,
                    date
                FROM d_sale 
                WHERE id =?`,
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
					console.error("getDetailSale Error:", error);
				}

				return {
					status: false,
					error
				}
			})
	}

	listSales(){
		const sql = {
			query: `
				SELECT
                    id,
					product_id,
					customer_id,
                    qty,
                    date
				FROM d_sale 
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
					console.error('Sale list Error:', error);
				}

				return {
					status: false,
					error,
				};
			});
	};
}

module.exports = new _sale();
