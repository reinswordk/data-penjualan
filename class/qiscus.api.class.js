const fetch = require('node-fetch');
const util = require('util');
const qiscus_config = require(__config_dir + '/qiscus.conf.json');

class qiscus {
	constructor(appId,secretKey,__url){
		this.config = {
			URL : {
				base : "https://api.qiscus.com",
				suffix : "/api/v2.1/rest",
			},
			headers :{},
		};

		this.config.apiURL = __url || (this.config.URL.base+this.config.URL.suffix)

		this.config.headers['Content-type'] = 'application/json';
		this.config.headers['QISCUS-SDK-APP-ID'] = appId || 'mes-chat-gbtzgh9qpifi';
		this.config.headers['QISCUS-SDK-SECRET'] = secretKey || 'dd07972e30507b7ff2e04bb3458be96e';
	}

	getStatus(status){
		status = String(status);

		if(status[0] == "2"){
			return true
		}
		else if(status[0] == "4"){
			return false
		}
		else{
			return false;
		}
	};

	loginRegister(username,password){
		const payload = {
				user_id : username,
				password : password,
				username : username,
				avatar_url : "",
			};

		const url = this.config.apiURL + '/login_or_register';
		const options = {
			method: 'POST',
			headers: this.config.headers,
			body : JSON.stringify(payload),
		};
		return fetch(url, options)
			.then(response => response.json())
			.then(async response => {
				if (this.getStatus(response.status)) {
					return {
						status : true,
						data : response.results,
					};
				}
				else {
					throw response;
				}
			})
			.catch(async error => {
				console.error('qiscusApi login_or_register :',error);
				return {
					status : false,
					error : error,
				};
			});
	};

	createRoom(username,data){
		const payload = {
				room_name : data.name || data.room_name,
				creator : username,
				participants : data.participants, // array of user_id
				room_avatar_url : data.avatar_url || data.room_avatar_url || "",
				room_options : data.options || data.room_options || JSON.stringify({
						status : "open",
						company : qiscus_config.company,
					}),
			};

		const url = this.config.apiURL + '/create_room';
		const options = {
			method: 'POST',
			headers: this.config.headers,
			body : JSON.stringify(payload),
		};

		return fetch(url, options)
			.then(response => response.json())
			.then(async response => {
				if (this.getStatus(response.status)) {
					return {
						status : true,
						data : response.results,
					};
				}
				else {
					throw response;
				}
			})
			.catch(async error => {
				console.error('qiscusApi createRoom :',util.inspect(error,{depth:null}));
				console.error('payload :',payload);
				console.error('---------createRoom---------');

				//~ //error handling when particpant doesnt have user_id
				//~ let newParticipants = payload.participants;
				//~ const errors = error.error.errors.participants; // <-- fuxk this object!!
				//~ if(Array.isArray(errors)){
					//~ for(const tmp of errors){
						//~ const match = tmp.match(/(.*?) not found/);
						//~ const employeeId = match[1];

						//~ if(employeeId){
							//~ newParticipants = newParticipants.filter(item => item != employeeId);
						//~ }
					//~ }

					//~ //console.log('newParticipants : ',participants,newParticipants);
					//~ return this.createRoom(username,{
							//~ ...payload,
							//~ participants : newParticipants, // array of user_id
						//~ });
				//~ }

				//error handling when particpant doesnt have user_id
				const participants = error.error.errors.participants; // <-- fuxk this object!!
				if(Array.isArray(participants)){
					const newParticipants = [];
					for(const tmp of participants){
						const match = tmp.match(/(.*?) not found/);
						const employeeId = match[1];

						if(employeeId){
							newParticipants.push(employeeId);
							await this.loginRegister(employeeId,employeeId);
						}
					}

					return this.createRoom(username,{
							...payload,
							participants : newParticipants, // array of user_id
						});
				}

				return {
					status : false,
					error : error,
				};
			});
	};

	updateRoom(data){
		const payload = {
				room_id : data.room.id,
				room_name : data.room.name,
				room_options : data.room.options,
			};

		const url = this.config.apiURL + '/update_room';
		const options = {
			method: 'POST',
			headers: this.config.headers,
			body : JSON.stringify(payload),
		};

		return fetch(url, options)
			.then(response => response.json())
			.then(async response => {
				if (this.getStatus(response.status)) {
					return {
						status : true,
						data : response.results,
					};
				}
				else {
					throw response;
				}
			})
			.catch(async error => {
				console.error('qiscusApi updateRoom :',error);
				console.error('qiscusApi updateRoom payload:',payload);
				return {
					status : false,
					error : error,
				};
			});
	};

	addRoomParticipants(id,participants){
		const payload = {
				room_id : id,
				user_ids : participants,
			};

		const url = this.config.apiURL + '/add_room_participants';
		const options = {
			method: 'POST',
			headers: this.config.headers,
			body : JSON.stringify(payload),
		};

		return fetch(url, options)
			.then(response => response.json())
			.then(async response => {
				if (this.getStatus(response.status)) {
					return {
						status : true,
						data : response.results,
					};
				}
				else {
					throw response;
				}
			})
			.catch(async error => {
				console.error('qiscusApi addRoomParticipants :',error);

				//error handling when particpant doesnt have user_id
				let newParticipants = participants;
				const errors = error.error.errors.user_ids; // <-- fuxk this object!!
				if(Array.isArray(errors)){
					for(const tmp of errors){
						const match = tmp.match(/(.*?) not found/);
						const employeeId = match[1];

						if(employeeId){
							newParticipants.push(employeeId);
							await this.loginRegister(employeeId,employeeId);
							//~ newParticipants = newParticipants.filter(item => item != employeeId);
						}
					}

					//~ console.log('newParticipants : ',participants,newParticipants);
					return this.addRoomParticipants(id, newParticipants);
				}

				return {
					status : false,
					error : error,
				};
			});
	};

	customMessage(username,roomId,content){
		/*
		 * for now, content must has these keys and value :
		 * {
		 * 	url : "https://res.cloudinary.com/dv45tycfk/image/upload/v1575361930/img/jit/ic_warning_icon_active.png",
		 *  order_number : "192DJ",
		 *  engine_name : "Engine 1"
         * }
        */

		const payload = {
			user_id : username,
			room_id : roomId,
			type : "custom",
			payload : {
				type : "init",
				content : content,
			}
		};

		const url = this.config.apiURL + '/post_comment';
		const options = {
			method: 'POST',
			headers: this.config.headers,
			body : JSON.stringify(payload),
		};

		return fetch(url, options)
			.then(response => response.json())
			.then(async response => {
				if (this.getStatus(response.status)) {
					return {
						status : true,
						data : response.results,
					};
				}
				else {
					throw response;
				}
			})
			.catch(async error => {
				console.error('qiscusApi customMessage :',error);

				return {
					status : false,
					error : error,
				};
			});
	};

	message(username,roomId,message){
		const payload = {
			user_id : username,
			room_id : roomId,
			message : message,
		};

		const url = this.config.apiURL + '/post_comment';
		const options = {
			method: 'POST',
			headers: this.config.headers,
			body : JSON.stringify(payload),
		};

		return fetch(url, options)
			.then(response => response.json())
			.then(async response => {
				if (this.getStatus(response.status)) {
					return {
						status : true,
						data : response.results,
					};
				}
				else {
					throw response;
				}
			})
			.catch(async error => {
				console.error('qiscusApi message :',error);
				return {
					status : false,
					error : error,
				};
			});
	};

	closeRoom(roomId, roomName){
		return this.updateRoom({
				room : {
					id : roomId,
					name : roomName,
					options : JSON.stringify({
							status : 'closed',
							company : qiscus_config.company,
						}),
				},
			});
	};
}

module.exports = qiscus;
