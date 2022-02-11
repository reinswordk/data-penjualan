const JSON5 = require('json5');

class __chartjs {
	constructor(id,type = 'line', labels = [], data = [], options = {}){
		this.id = id;
		this.type= type;
		this.labels= labels;
		this.data= data;
		this.options= options;
		this.color= this.randomColor(0.65);
		this.prefixId = "chartjs_container_";
	}

	randomColor(opacity=0.9){
		return 'rgba('+(Math.round(Math.random()*1000)%256)+','+(Math.round(Math.random()*1000)%256)+','+(Math.round(Math.random()*1000)%256)+','+opacity+')'
	}

	create(){
		return {
			container : this.generateContainer(this.id),
			script : this.generateScript(this.id),
		};
	};

	generateContainer(id){
		return '<canvas id="'+this.prefixId+id+'"></canvas>';
	}

	generateScript(id,type = 'line', labels = [], data = [], options = {}){
		return 'var chartjs_'+id+' = new Chart(document.getElementById("'+this.prefixId+id+'"),'
			+ this.generateBody(this.type, this.labels, this.data, this.options)
			+');';
	}

	generateBody(type = 'line', labels = [], data = [], options = {}) {
		const chartOptions = {
			type: type,
			data: {
				labels: labels,
				datasets: [
					{
						label: options.title,
						fill: true,
						data: data,
						backgroundColor: options.backgroundColor ? options.backgroundColor : this.color,
						borderColor: options.backgroundColor ? options.backgroundColor : this.color,
						borderWidth: 1
					},
				]
			},
			options: {
				legend: {
					display: options && options.legend ? options.legend : false,
					position: 'top',
					labels: {
						boxWidth: 80,
						fontColor: options.fontColor ? options.fontColor : 'rgb(60, 180, 100)'
					}
				},
				tooltips: {
					cornerRadius: 4,
					mode: 'index',
					intersect: false,
					caretSize: 14,
					xPadding: 16,
					yPadding: 10,
					backgroundColor: 'rgba(100, 100, 100, 0.86)',
					titleFontStyle: 'normal',
					titleMarginBottom: 15,
					callbacks: {
						label: '`(tooltipItem, data) => {return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] +" '+(options.unit ? options.unit : '')+'";}`',
					}
					//~ callback: '`function(value, index, values){return value+ "'+(options.unit ? options.unit : '')+'";}`',
				},

				scales: {
					yAxes: [
						{
							ticks: {
								beginAtZero: true,
								display : true,
								max: options.max ? options.max : undefined,
								min: options.min ? options.min : undefined,
								//~ stepSize: options.stepSize ? options.stepSize : undefined,
								fontColor: '#ffffff',
							}
						}
					],
					xAxes: [
						{
							ticks: {
								display : false,
							}
						}
					],
				},
			}
		};

		if (options.drawLineAt) {
			chartOptions.options.annotation =  {
				annotations : [{
					type: 'line',
					mode: 'horizontal',
					scaleID: 'y-axis-0',
					value: options.drawLineAt.value,
					borderColor: options.drawLineAt.color ? options.drawLineAt.color : 'rgba(255,50,50,0.75)',
					borderWidth: options.drawLineAt.width ? options.drawLineAt.width : 2,
					label: {
						enabled: options.drawLineAt.label ? options.drawLineAt.label : true,
						backgroundColor: options.drawLineAt.color ? options.drawLineAt.color : 'rgba(255,50,50,0.75)',
						content: options.drawLineAt.value,
						position : 'left'
					}
				}]
			};
		}


		return JSON5.stringify(chartOptions).replace(/\'`|`\'/g,'');
	}
}

module.exports = __chartjs
