function showToast(title,subtitle,content,type,delay){
	$.toast({
		title: title,
		subtitle: subtitle,
		content: content,
		type: type,
		pause_on_hover: true,
		delay: delay
	});
}

function checkSensorValue() {
	const colors = {
		bad: 'rgba(255,0,0,1.0)',
		good: 'rgba(0,255,0,1.0)',
	};

	$('.sensor').each(function (idx, obj) {
		const elem = $(this);
		const typeSensor = elem.children('.title').text().trim();
		const timestamp = elem.children('.time').text().trim();
		const alarmLight = elem.find('.alarm-light').children('.light');
		const currentVal = parseFloat(elem.find('.sensor-value-box').children('.value').text().trim());
		const limitVal = parseFloat(elem.find('.limit-value').text().trim());
		const limitComparison = elem.find('.limit-comparison').text().trim();

		const message = 'Sensor Value Crossed Limit';

		switch (limitComparison) {
			case ">":
				if (currentVal > limitVal) {
					alarmLight.css('background-color', colors.good);
				}
				else {
					alarmLight.css('background-color', colors.bad);
					showToast(typeSensor,timestamp,message,'danger',10000);
				}
				break;

			case ">=":
				if (currentVal >= limitVal) {
					alarmLight.css('background-color', colors.good);
				}
				else {
					alarmLight.css('background-color', colors.bad);
					showToast(typeSensor,timestamp,message,'danger',10000);
				}
				break;

			case "<":
				if (currentVal < limitVal) {
					alarmLight.css('background-color', colors.good);
				}
				else {
					alarmLight.css('background-color', colors.bad);
					showToast(typeSensor,timestamp,message,'danger',10000);
				}
				break;

			case "<=":
				if (currentVal <= limitVal) {
					alarmLight.css('background-color', colors.good);
				}
				else {
					alarmLight.css('background-color', colors.bad);
					showToast(typeSensor,timestamp,message,'danger',10000);
				}
				break;

			case "=":
				if (currentVal == limitVal) {
					alarmLight.css('background-color', colors.good);
				}
				else {
					alarmLight.css('background-color', colors.bad);
					showToast(typeSensor,timestamp,message,'danger',10000);
				}
				break;

			default:
				break;
		}
	});
}
