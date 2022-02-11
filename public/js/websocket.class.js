class websocket{
	constructor(url, autoReconnect = true, parseJSON = true) {
		const self = this;
		self.parseJSON = parseJSON;
		self.autoReconnect = autoReconnect;
		self.url = url.replace(/http/i, 'ws');
		self.con = new WebSocket(self.url);

		self.con.onopen = function (data) {
			console.log('Connection to ' + self.url + ' established');
		};

		self.con.onclose = function (e) {
			if(self.autoReconnect){
				console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
				setTimeout(function () {
					self.con = new WebSocket(self.url);
				}, 1000);
			}
		};

		self.con.onerror = function (error) {
			console.error(error);
			self.con.close();
		};
	}
}
