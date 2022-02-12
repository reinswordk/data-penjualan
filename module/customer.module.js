const config = require(`${__config_dir}/app.config.json`);
const {debug} = config;
const helper = require(`${__class_dir}/helper.class.js`);
const mysql = new(require(`${__class_dir}/mariadb.class.js`))(config.db);
const __handler = require(__basedir + '/class/fileHandling.class.js');
const handler = new __handler(__basedir + '/public/image/parts/');

class _customer{
	deleteProduct(id){
		const sql = {
			query: `DELETE FROM s_customer WHERE id = ?`,
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
					console.error('deleteCustomer Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	updateCustomer(data){
		const sql = {
			query: `UPDATE s_customer SET first_name = ?, last_name = ? WHERE id = ?`,
			params: [data.name, data.price, data.id]
		}

		return mysql.query(sql.query, sql.params)
			.then(data => {
				return {
					status: true,
					data
				}
			}).catch(error => {
				if(debug){
					console.error('updateCustomer Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	addCustomer(data){
		const sql = {
			query: `INSERT INTO s_customer(id, first_name, last_name) VALUES (?, ?, ?)`,
			params: [data.id, data.first_name, data.last_name]
		}

		return mysql.query(sql.query, sql.params)
			.then(data => {
				return {
					status: true,
					data
				}
			}).catch(error => {
				if(debug){
					console.error('addCustomer Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	getDetailCustomer(id){
		const sql = {
			query: `
				SELECT
					cus.id,
					cus.first_name,
					cus.last_name
				FROM s_customer cus
				WHERE pro.id = ?`,
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
					console.error("getDetailCustomer Error:", error);
				}

				return {
					status: false,
					error
				}
			})
	}

	listCustomer(){
		const sql = {
			query: `
				SELECT
					cus.id,
					cus.first_name,
					cus.last_name
				FROM s_customer cus
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
					console.error('Customer list Error:', error);
				}

				return {
					status: false,
					error,
				};
			});
	};
}

module.exports = new _customer();
