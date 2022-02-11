const date = require('date-and-time');
const __mysql = require(__class_dir + '/mariadb.class.js');

const helper = require(__class_dir + '/helper.class.js');
const config = require(__config_dir + '/app.config.json');
const mysql = new __mysql(config.db);

class __class {
	list(){
		const sql = {
				query : `SELECT
					aa.menuId id,
					aa.menuName title,
					aa.menuIcon icon,
					aa.menuLink link,
					aa.menuGroup,
					aa.menuOrder,
					aa.menuParentMenuId parentId
				FROM auth_group_menu aa ORDER BY aa.menuOrder ASC, aa.menuId ASC`,
				params : [],
			};

		return mysql.query(sql.query, sql.params)
			.then(results => {
				const groups = {};

				for(const tmp of results){
					if(!groups[tmp.menuGroup]){
						groups[tmp.menuGroup] = [];
					}

					groups[tmp.menuGroup].push(tmp);
				}

				//~ console.log( helper.objectToArray(groups));

				return {
						status : true,
						data : helper.objectToArray(groups),
					};
			})
			.catch(error => {
				console.error('menu list error:', error);
				return {
						status : false,
						error,
						data : [],
					};
			});
	};
}

module.exports = new __class();
