const date = require('date-and-time');
const fs = require('fs');
const pki = require('node-forge').pki;
const jsonwebtoken = require('jsonwebtoken');
const hashids = new(require('hashids'))(__random);

const config = require(__config_dir + '/app.config.json');
const certificates = config.certificates;
const jwtConfig = config.jwt;

const helper = require(__class_dir + '/helper.class.js');
const hash = require(__class_dir + '/hash.class.js');
const mysql = new(require(__class_dir + '/mariadb.class.js'))(config.db);

const jwt = {
    validation(token = null) {
        if (!token) {
            return {
                status: false,
                error: 'Token is empty'
            };
        }

        return new Promise((resolve, reject) => {
                jsonwebtoken.verify(token, jwtConfig.passcode, (error, decoded) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(decoded);
                    return;
                });
            })
            .then(data => {
                return {
                    status: true,
                    data,
                };
            })
            .catch(error => {
                return {
                    status: false,
                    error,
                };
            });
    },

    sign(payload, options = { algorithm: 'HS256', expiresIn: '30m' }) {
        return new Promise((resolve, reject) => {
            jsonwebtoken.sign(payload, jwtConfig.passcode, options, (err, token) => {
                if (err) {
                    reject(false);
                    return;
                }

                resolve(token);
                return;
            });
        });
    },
};

const menuList = function (groupId, parentId) {
	const sql = {
		query: `SELECT
				aa.menuId id,
				aa.menuName title,
				aa.menuIcon icon,
				aa.menuLink link,
				aa.menuGroup,
				aa.menuOrder,
				aa.menuParentMenuId parentId
			FROM auth_group_menu aa
			WHERE 1`,
		params: [],
	};

	if(groupId){
		sql.query += ` AND (aa.menuGroup = ? OR aa.menuGroup IS NULL)`;
		sql.params.push(groupId);
	}

	if(parentId){
		sql.query += ` AND aa.menuParentMenuId = ?`;
		sql.params.push(parentId);
	} else {
		sql.query += ` AND aa.menuParentMenuId IS NULL`;
	}

	sql.query += ` ORDER BY aa.menuOrder ASC, aa.menuId ASC`;

	return mysql.query(sql.query, sql.params)
		.then(async results => {
			const groups = [];

			for (const tmp of results) {
				if (tmp.link) {
					const matches = tmp.link.match(/hashids\((.*?)\)/g);
					if (matches) {
						for (const text of matches) {
							const identifier = text.match(/hashids\((.*?)\)/);
							tmp.link = tmp.link.replace(identifier[0], hashids.encode(identifier[1]) || identifier[1]);
						}
					}
				}

				tmp.children = await menuList(groupId, tmp.id);
				groups.push(tmp);
			}

			return groups;
		})
		.catch(error => {
			if (config.debug) console.error('menu list error:', error);
			return null;
		});
};

const checkContentType = function (headers, contentType = 'application/json') {
	return (headers['content-type'] && headers['content-type'].toLowerCase() == contentType);
};

const getUserExistence = function (userName) {
	return mysql.query('SELECT COUNT(userName) AS __ROWS FROM auth_user WHERE userName = ?', [userName])
		.then(results => results[0].__ROWS == 1 ? true : false)
		.catch(error => {
			return false;
		});
};

const getEmployeeExistence = function (userName) {
	return mysql.query('SELECT COUNT(employeeId) AS __ROWS FROM s_employee WHERE employeeId = ?', [userName])
		.then(results => results[0].__ROWS == 1 ? true : false)
		.catch(error => {
			return false;
		});
};

const updateLastAccess = function (userName) {
	return mysql.query(
			'UPDATE auth_user SET userLastAccess = ? WHERE userName = ?',
			[date.format(new Date, 'YYYY-MM-DD HH:mm:ss'), userName]
		)
		.then(result => true)
		.catch(error => {
			if (config.debug) console.error('updateLastAccess Error', error);
			return false;
		});
};

const tokenValidation = async function (token) {
	const validity = await jwt.validation(token);

	if (!validity.status) {
		return validity;
	}

	if (validity.data.l >= 11 && validity.data.l <= 19) {
		validity.status &= await getEmployeeExistence(validity.data.u);
	} else {
		validity.status &= await getUserExistence(validity.data.u);
	}

	return validity;
};

const tokenInfo = async function (token) {
	const validity = await jwt.validation(token);

	if (validity.status) {
		return validity.data;
	} else {
		return null;
	}
};

const sslCert = {
    async loadCAs(_paths) {
        const pemStrings = [];

        for (const _path of _paths) {
            pemStrings.push(await fs.promises.readFile(_path, 'ascii'));
        }

        return pemStrings;
    },

    verifyChains(CAfiles, clientCert) {
        const chains = [...CAfiles, clientCert];
        const length = chains.length;
        let index = 1;

        do {
            try {
                const parent = pki.certificateFromPem(chains[index - 1]);
                const child = pki.certificateFromPem(chains[index]);
                parent.verify(child);
            } catch (error) {
                return {
                    status: false,
                    error: String(error).split('\n')[0].replace('Error: ', ''),
                };
            }
        } while (++index < length);

        return {
            status: true,
        };
    },
};

const getUserGroupPermission = function (userName, path) {
	// groupId 0 is for superadmin and id 1 is for administrator
	const sql = {
			query: `SELECT DISTINCT
				gr.groupId id,
				gr.groupName name,
				usr.userName userName,
				acc.gracAllowedPath path
			FROM auth_user usr
			LEFT JOIN auth_user_group usrgr ON usr.userName = usrgr.userName
			LEFT JOIN auth_group gr ON usrgr.groupId = gr.groupId
			JOIN auth_group_access acc ON gr.groupId=acc.gracGroupId
			WHERE usr.userName = ?`,
			params: [userName],
		};

	return mysql.query(sql.query, sql.params)
		.then(results => {
			// TODO: check fro "/site" access
			if(!path){
				return true;
			}

			for (record of results) {
				if (path.includes(record.path) || record.id === 0){
					return true;
				}
			}

			throw results;
		})
		.catch(error => {
			if (config.debug) console.error('getUserGroupPermission Error:', error);
			return false;
		});
};

const getEmployeeGroupPermission = function (employeeId, path) {
	// groupId 0 is for superadmin and id 1 is for administrator
	const sql = {
			query: `SELECT DISTINCT
				gr.groupId id,
				gr.groupName name,
				emp.employeeId employeeId,
				acc.gracAllowedPath path
			FROM s_employee emp
			LEFT JOIN auth_employee_group egr ON emp.employeeId = egr.employeeId
			LEFT JOIN auth_group gr ON egr.groupId = gr.groupId
			JOIN auth_group_access acc ON gr.groupId = acc.gracGroupId
			WHERE emp.employeeId = ?`,
			params: [employeeId],
		};

	return mysql.query(sql.query, sql.params)
		.then(results => {
			// TODO: check fro "/site" access
			if(!path){
				return true;
			}

			for (record of results) {
				if (path.includes(record.path) || record.id === 0){
					return true;
				}
			}

			throw results;
		})
		.catch(error => {
			if (config.debug) console.error('getUserGroupPermission Error:', error);
			return false;
		});
};

class __session {
    /**
     * Header Auhtorization contains PEM formatted certificate encoded in Base64.
     * The Provided Certificate would be verified against CAs to check whether it's issued by the CAs or not
     * */
    async verifyCert(req, res, next) {
        const clientCert = Buffer.from((req.headers['x-access-token'] || req.headers['authorization']).replace('Bearer ', ''), 'base64').toString('ascii');
        const CAs = await sslCert.loadCAs(certificates);
        const isValid = await sslCert.verifyChains(CAs, clientCert);

        if (!isValid.status) {
			helper.sendResponse(res, isValid);
        }

        next();

        return true;
    };

	async groupChecker(req, res, next) {
		if (req.originalUrl.includes('/site/') && req.originalUrl !== '/site/404') {
			if (req.session && req.session.token) {
				try {
					const info = await tokenInfo(req.session.token);
					let isPermitted = false;
					
					if ( info.l >= 11 && info.l <= 19) {
						isPermitted = await getEmployeeGroupPermission(info.u);
					} else {
						isPermitted = await getUserGroupPermission(info.u);
					}

					if (isPermitted) {
						next();
						return true;
					} else {
						throw `User Doesn't Have Access`;
					}
				} catch (error) {
					if (config.debug) console.error('groupChecker', error);
					res.redirect(__publicurl + '/404');
				}
			}
		} else if (req.headers && req.headers.authorization) {
			const authorization = req.headers.authorization.split(' ');

			try {
				if (authorization[0].toLowerCase() == 'bearer' && authorization[1]) {
					const info = await tokenInfo(authorization[1]);

					let isPermitted = false;
					
					if ( info.l >= 11 && info.l <= 19) {
						isPermitted = await getEmployeeGroupPermission(info.u, req.originalUrl);
					} else {
						isPermitted = await getUserGroupPermission(info.u, req.originalUrl);
					}

					if (isPermitted) {
						next();
						return true;
					} else {
						throw `User Doesn't Have Access`;
					}
				} else {
					throw 'invalid auth groupChecker';
				}
			} catch (error) {
				helper.sendResponse(res, {
						status: false,
						error,
					});

				return false;
			}

		} else {
			next();
			return true;
		}
	};

	async sessionChecker(req, res, next) {
		try {
			if (req.session && req.session.token) {
				const isValid = await tokenValidation(req.session.token);
				if (isValid.status) {
					next();
					return true;
				} else {
					req.session.destroy()
					req.logout();

					throw isValid;
				}

				return;
			} else if (req.headers && req.headers.authorization) {
				const authorization = req.headers.authorization.split(' ');

				if (authorization[0].toLowerCase() == 'bearer' && authorization[1]) {
					const isValid = await tokenValidation(authorization[1]);

					if (isValid.status) {
						req.decoded = isValid.data;
						next();
						return true;
					} else {
						throw isValid;
					}
				} else {
					throw 'invalid authorization';
				}
			} else if (req.query && req.query.token) {
				const isValid = await tokenValidation(decodeURIComponent(req.query.token));

				if (isValid.status) {
					req.decoded = isValid.data;
					return true;
				} else {
					throw isValid;
				}
			} else {
				throw 'token is not defined';
			}
		} catch (error) {
			if (config.debug) {
				if (config.debug) console.error('sessionChecker error:', req.originalUrl.substring(0, 64), error);
			}

			if (req.query && req.query.token) {
				return false;
			} else {
				if (checkContentType(req.headers, 'application/json') || req.originalUrl.includes('/api/')) {
					helper.sendResponse(res, {
							status: false,
							error,
						});

					return false;
				} else {
					res.redirect(__publicurl + '/auth/login');
					return false;
				}
			}
		}
	}

	async getTokenInfo(req, res, next) {
		try {
			const response = {
				method: null,
				content: null,
			};

			let token = null;

			if (req.session && req.session.token) {
				token = req.session.token;
				response.method = 'session';
			} else if (req.headers && req.headers.authorization) {
				const authorization = req.headers.authorization.split(' ');

				if (authorization[0].toLowerCase() == 'bearer' && authorization[1]) {
					token = authorization[1];
					response.method = 'headers';
				}
			} else if (req.query && req.query.token) {
				token = req.query.token;
				response.method = 'query';
			} else {
				throw 'invalid token';
			}

			response.content = token ? JSON.parse(await helper.xdecMe(token)) : false;

			if (response.content) {
				delete response.content.iv;
				delete response.content.random;

				return {
					status: true,
					data: response,
				};
			} else
				throw isValid;
		} catch (error) {
			if (config.debug) console.error('getTokenInfo error:', error);
			return {
				status: false,
				error: error,
			};
		}
	}

	async addUserToGroup(userName, groupId){
		const sql = {
			query: `SELECT
					COUNT(bb.userName) exist
				FROM auth_user aa
				JOIN auth_user_group bb ON bb.userName = aa.userName
				WHERE
					bb.userName = ?
					AND bb.groupId = ?`,
			params: [
					userName,
					groupId,
				],
		};

		const checkExistance = await mysql.query(sql.query, sql.params)
			.then(results => results[0].exist == 1 ? true : false)
			.catch(error => {
				console.error('updateUser checkExistance Error:', error);
				return false;
			});

		// user not found or user-group are already in db, return false
		if(checkExistance){
			return {
				status: false,
				error: `user ${userName} is not found or already inside the group`,
			};
		}

		const insertSQL = {
			query: `INSERT INTO auth_user_group(userName, groupId) VALUES (?,?);`,
			params: [userName, groupId],
		};

		return mysql.query(insertSQL.query, insertSQL.params)
			.then(data => {
				return {
					status: true,
					data,
				};
			})
			.catch(error => {
				console.error('addUserToGroup error', error);
				return {
					status: false,
					error,
				};
			})
	};

	async registerUser(userName, password, groupId = null, isUpdate = false) {
		if (!userName.match(/^[a-zA-Z0-9_]{4,}$/)) {
			return {
				status: false,
				error: 'username min. 4 Chars and contains only alphanumeric or underscore',
			};
		}

		if (String(password).length < 8) {
			return {
				status: false,
				error: 'Password min. 8 chars',
			};
		}

		const sql = {
			query: `INSERT INTO auth_user SET
				userName = ?,
				password = ?`,
			params: [
					userName,
					hash.sha256(password),
				],
		};

		if (isUpdate) {
			sql.query += ` ON DUPLICATE KEY UPDATE password = VALUES(password)`;
		}

		const addUser = await mysql.query(sql.query, sql.params)
			.then(results => {
				return {
					status: true,
					data: {
						userName,
					},
				};
			})
			.catch(error => {
				return {
					status: false,
					error,
				};
			});

		if(!addUser.status){
			return addUser;
		}

		const addToGroup = typeof(groupId) === 'number'
			? await this.addUserToGroup(userName, groupId)
			: {status: false, error: 'group id is empty'};

		if(!addToGroup.status){
			return {...addToGroup,...addUser};
		}

		return addUser;
	};

	async updateUser(userName, password, groupId = null) {
		const sql = {
			query: `SELECT
					COUNT(userName) exist
				FROM auth_user aa
				WHERE
					aa.userName = ?
					AND aa.password = ?`,
			params: [
					userName,
					hash.sha256(password),
				],
		};

		const checkExistance = await mysql.query(sql.query, sql.params)
			.then(results => results[0].exist == 1 ? true : false)
			.catch(error => {
				console.error('updateUser checkExistance Error:', error);
				return false;
			});

		if(!checkExistance){
			return {
				status: false,
				error: 'Invalid Username or Password',
			};
		}

		return registerUser(userName, password, groupId, true);
	};

	async registerUser_batch(users) {
		const data = [];
		for (const tmp of users) {
			data.push(await this.registerUser(tmp.username, tmp.password));
		}

		return {
			status: true,
			data,
		};
	};

	async loginValidation(req, res, next) {
		const username = req.body.username || req.body.userName;
		const password = req.body.password;
		const fromSite = req.body.fromSite;
		const employee = req.body.emp;
		const ipAddr = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
		const {expired} = config.jwt;

		if (username && username.length <= 0) {
			if (!fromSite || checkContentType(req, 'application/json')) {
				return {
					status: false,
					error: 'username is empty',
				};
			} else {
				res.render('pages/login', {
					messages: {
						errors: {
							invalidEmailOrPassword: 'Username is empty',
						}
					}
				});

				return false;
			}
		}

		let userExist = 0

		if (employee) {
			userExist = await mysql.query(
				`SELECT
					IF(COUNT(*)>0,1,0) isValid,
					emp.employeeId user,
					emp.employeeName name,
					gr.groupId,
					gr.groupLevel level
				FROM s_employee emp
				LEFT JOIN auth_employee_group egr ON egr.employeeId = emp.employeeId
				LEFT JOIN auth_group gr ON gr.groupId = egr.groupId
				WHERE emp.employeeId = ? AND emp.password = ?`,
				[username, hash.sha256(password)]
			)
			.then(results => {
				return (results[0].isValid > 0) ? (results[0]) : (null);
			})
			.catch(error => {
				if (config.debug) console.error('userExist error:', error);
				return false;
			});
		} else {
			userExist = await mysql.query(
				`SELECT
					IF(COUNT(*)>0,1,0) isValid,
					usr.userName user,
					gr.groupId,
					gr.groupLevel level
				FROM auth_user usr
				LEFT JOIN auth_user_group ugr ON ugr.userName = usr.userName
				LEFT JOIN auth_group gr ON gr.groupId = ugr.groupId
				WHERE usr.userName = ? AND usr.password = ?`,
				[username, hash.sha256(password)]
			)
			.then(results => {
				return (results[0].isValid > 0) ? (results[0]) : (null);
			})
			.catch(error => {
				if (config.debug) console.error('userExist error:', error);
				return false;
			});
		}

		try {
			if (!userExist) {
				throw false;
			}

			const expiresAt = date.format(new Date( Date.now() + expired ), 'YYYY-MM-DD HH:mm:ss.SSS');
			const payload = {
					u: userExist.user,
					n: userExist.name ? userExist.name:undefined,
					l: userExist.level,
					t: expiresAt,
					v: hash.randomString(18, 'base64'),
				};
			const token = await jwt.sign(payload, {expiresIn:String(expired)});

			// if login is from api
			if (!fromSite || checkContentType(req.headers, 'application/json')) {
				updateLastAccess(username);

				helper.sendResponse(res, {
						status: true,
						data: {token, expiresAt},
					});
			}
			// if login is from site page
			else {
				req.session.decoded = payload;
				req.session.token = token;
				res.cookie('token', req.session.token);

				//get saved profile pic's URI if exist
				const picture = await mysql.query(`SELECT userPictureURL url FROM auth_user WHERE userName = ?`, [userExist.user])
					.then(results => {
						return results[0].url;
					})
					.catch(error => {
						return null;
					});

				const profile = {
					results: [
							{
								picture: {
									large: picture
										? picture
										: __siteurl + '/img/brand/logo/logo.png',
								}
							}
						],
				};

				req.session.profile = {
					userInfo: {
						name: userExist.user,
						picture: profile ? profile.results[0].picture.large : ''
					}
				};

				/***** generate menu from db *****/
				req.session._menus = await menuList(userExist.groupId);

				res.redirect(__publicurl + '/dashboard');

				updateLastAccess(username);
			}

			return true;
		} catch (error) {
			if (config.debug) console.error('loginValidation Error', error);
			if (!fromSite || checkContentType(req.headers, 'application/json')) {
				helper.sendResponse(res,{
						status: false,
						error: 'Invalid Username or Password',
					});
			} else {
				res.render('pages/login', {
					messages: {
						errors: {
							invalidEmailOrPassword: error || 'Invalid Username or Password',
						}
					}
				});
			}

			return false;
		}
	}

	logout(req, res, next) {
		req.session.destroy();
		res.clearCookie('user_sid');
		res.clearCookie('token');

		res.redirect(__publicurl + '/auth/login');
	}

	logoutV2(req, res, next) {
		req.session.destroy();
		res.clearCookie('token');

		res.send({
			status: true,
			data: "Logout success!"
		});
	}

	async userInfo(username){
		const sql = {
				query: `SELECT
						gr.groupId,
						gr.groupName,
						gr.groupLevel
					FROM auth_user usr
					JOIN auth_user_group ugr ON ugr.userName = usr.userName
					JOIN auth_group gr ON gr.groupId = ugr.groupId
					WHERE
						usr.userName = ?`,
				params: [username],
			};

		return mysql.query(sql.query, sql.params)
			.then(results => {
				const data = {
						username,
						group: [],
					};

				for(const item of results){
					data.group.push({
						id: item.groupId,
						name: item.groupName,
						level: item.groupLevel,
					});
				}

				return {
					status: true,
					data,
				};
			})
			.catch(error => {
				if (config.debug){
					console.error('session userInfo error:', error);
				}

				return {
					status: false,
					error,
				};
			});
	};

	async changePassword(userName, oldPassword, newPassword){
		const self = this;

		const isOldPasswordValid = await mysql.query(
				`SELECT
					COUNT(usr.userId) isValid
				FROM auth_user usr
				WHERE usr.userName = ? AND usr.password = ?`,
				[userName, hash.sha256(oldPassword)],
			)
			.then(data => {
				return data[0].isValid > 0 ? true : false;
			})
			.catch(error => {
				if(config.debug){
					console.error('session changePassword Error:', error);
				}

				return false
			});

		if(!isOldPasswordValid){
			return {
				status: false,
				error: `Old Password doesn't match`,
			};
		}

		const update = await self.registerUser(userName, newPassword, null, true);

		if(update.status){
			return {
					...update,
					data: `Password has been changed`
				};
		}

		return update;
	};
}

module.exports = new __session();
