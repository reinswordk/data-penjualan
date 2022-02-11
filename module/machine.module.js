const config = require(`${__config_dir}/app.config.json`);
const {debug} = config;
const helper = require(`${__class_dir}/helper.class.js`);
const mysql = new(require(`${__class_dir}/mariadb.class.js`))(config.db);
const __handler = require(__basedir + '/class/fileHandling.class.js');
const handler = new __handler(__basedir + '/public/image/parts/');

class _machine{
	deleteMachine(id){
		const sql = {
			query: `DELETE FROM s_machine WHERE machineId = ?`,
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
					console.error('deleteMachine Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	updateMachine(data){
		const sql = {
			query: `UPDATE s_machine SET machineName = ? WHERE machineId = ?`,
			params: [data.name, data.id]
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
					console.error('updateMachine Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	addMachine(data){
		const sql = {
			query: `INSERT INTO s_machine(machineName) VALUES (?)`,
			params: [data.name]
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
					console.error('addMachine Error:', error);
				}

				return {
					status: false,
					error
				}
			})
	}

	listMachineProduction(){
		const formatDateNow = helper.formatDate(new Date(), "YYYY-MM-DD HH:mm:ss")
		
		const sql = {
			query: `
				SELECT
					mcn.machineId,
					mcn.machineName
				FROM s_machine mcn
				JOIN d_shift shf ON mcn.machineId = shf.machineId
				WHERE 1`,
			params: [],
		};

		sql.query += ` AND shf.shiftDate = f_determine_shift_date(?)
					GROUP BY mcn.machineId`
		sql.params.push(formatDateNow)

		return mysql.query(sql.query, sql.params)
			.then(async data => {
				let tmp = [];

				for (let key in data) {
					tmp.push({
						id: data[key].machineId,
						name: data[key].machineName
					})
				}

				return {
					status: true,
					data: tmp
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
					console.error('machine list production Error:', error);
				}

				return {
					status: false,
					error,
				};
			});
	};

	listMachine(options = {}){
		const { id } = options
		const sql = {
				query: `
                    SELECT
						mcn.machineId,
						mcn.machineName
					FROM s_machine mcn
					WHERE 1`,
				params: [],
			};

		if (id) {
			sql.query += ` AND mcn.machineId = ?`;
			sql.params.push(id);
		}

		sql.query += ` ORDER BY mcn.timestamp DESC`

		return mysql.query(sql.query, sql.params)
			.then(async data => {
				let tmp = [];

				for (let key in data) {
					tmp.push({
						id: data[key].machineId,
						name: data[key].machineName
					})
				}

				return {
					status: true,
					data: id ? tmp[0]:tmp
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
					console.error('machine list Error:', error);
				}

				return {
					status: false,
					error,
				};
			});
	};
}

module.exports = new _machine();
