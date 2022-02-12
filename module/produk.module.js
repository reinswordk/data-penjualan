const config = require(`${__config_dir}/app.config.json`);
const {debug} = config;
const helper = require(`${__class_dir}/helper.class.js`);
const mysql = new(require(`${__class_dir}/mariadb.class.js`))(config.db);
const __handler = require(__basedir + '/class/fileHandling.class.js');
const handler = new __handler(__basedir + '/public/image/parts/');

class _product{
	deleteProduct(id){
		const sql = {
			query: `DELETE FROM s_produk WHERE id = ?`,
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

	updateProduct(data){
		const sql = {
			query: `UPDATE s_produk SET name = ?, price = ? WHERE id = ?`,
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
					console.error('updateProduct Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	addProduct(data){
		const sql = {
			query: `INSERT INTO s_produk(id, name, price) VALUES (?, ?, ?)`,
			params: [data.id, data.name, data.price]
		}

		return mysql.query(sql.query, sql.params)
			.then(data => {
				return {
					status: true,
					data
				}
			}).catch(error => {
				if(debug){
					console.error('addProduct Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	getDetailProduct(id){
		const sql = {
			query: `
				SELECT
					pro.id,
					pro.name,
					pro.price
				FROM s_produk pro
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
					console.error("getDetailProduct Error:", error);
				}

				return {
					status: false,
					error
				}
			})
	}

	listProduct(){
		const sql = {
			query: `
				SELECT
					pro.id,
					pro.name,
					pro.price
				FROM s_produk pro
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
					console.error('Product list Error:', error);
				}

				return {
					status: false,
					error,
				};
			});
	};
}

module.exports = new _product();
