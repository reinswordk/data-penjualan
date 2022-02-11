const config = require(`${__config_dir}/app.config.json`);
const {debug} = config;
const helper = require(`${__class_dir}/helper.class.js`);
const mysql = new(require(`${__class_dir}/mariadb.class.js`))(config.db);
const __handler = require(__basedir + '/class/fileHandling.class.js');
const handler = new __handler(__basedir + '/public/image/parts/');

class _karyawan{
	deleteKaryawan(id){
		const sql = {
			query: `DELETE FROM tb_employee WHERE id = ?`,
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
					console.error('deleteKaryawan Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	updateKaryawan(data){
		const sql = {
			query: `UPDATE tb_employee SET name = ?, date_birth = ?, position = ? WHERE id = ?`,
			params: [data.name, data.date_birth, data.position, data.id]
		}

		return mysql.query(sql.query, sql.params)
			.then(data => {
				return {
					status: true,
					data
				}
			}).catch(error => {
				if(debug){
					console.error('updateKaryawan Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	addKaryawan(data){
		const sql = {
			query: `INSERT INTO tb_employee(id, name, date_birth, position) VALUES (?, ?, ?, ?)`,
			params: [data.employee_id, data.name, data.date_birth, data.position]
		}

		return mysql.query(sql.query, sql.params)
			.then(data => {
				return {
					status: true,
					data
				}
			}).catch(error => {
				if(debug){
					console.error('addKaryawan Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	getDetailKaryawan(id){
		const sql = {
			query: `
				SELECT
					emp.id,
					emp.name,
					emp.date_birth,
					emp.position
				FROM tb_employee emp
				WHERE emp.id = ?`,
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
					console.error("getDetailKaryawan Error:", error);
				}

				return {
					status: false,
					error
				}
			})
	}

	listKaryawan(){
		const sql = {
			query: `
				SELECT
					emp.id,
					emp.name,
					emp.date_birth,
					emp.position
				FROM tb_employee emp
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
					console.error('karyawan list Error:', error);
				}

				return {
					status: false,
					error,
				};
			});
	};
}

module.exports = new _karyawan();
