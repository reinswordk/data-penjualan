
class __display {
	constructor(wrapper, data){
		this.wrapperName = wrapper;
		console.log(data);
		this.generateBOD(data.bod);
		this.generateProdLine(data.prodline.data);
	}

    initDoughnutChart(containerClass, machine, series, OEE) {
        const ctx = $(this.wrapperName).find('.'+containerClass)[0];

        //disable animation
		Chart.defaults.global.animation.duration = 0;

        Chart.pluginService.register({
            beforeDraw: function(chart) {
                if (chart.config.options.elements.center) {
                    //Get ctx from string
                    const ctx = chart.chart.ctx

                    //Get options from the center object in options
                    const centerConfig = chart.config.options.elements.center
                    const fontStyle = centerConfig.fontStyle || 'Arial'
                    const txt = centerConfig.text
                    const color = centerConfig.color || '#000'
                    const sidePadding = centerConfig.sidePadding || 10
                    const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
					//Start with a base font of 30px
                    ctx.font = "30px " + fontStyle

                    //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
                    const stringWidth = ctx.measureText(txt).width
                    const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated

                    // Find out how much the font can grow in width.
                    const widthRatio = elementWidth / stringWidth
                    const newFontSize = Math.floor(30 * widthRatio)
                    const elementHeight = (chart.innerRadius * 2)

                    // Pick a new font size so it will not be larger than the height of label.
                    const fontSizeToUse = Math.min(newFontSize, elementHeight)

                    //Set font settings to draw it correctly.
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2)
                    const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2)
                    ctx.font = fontSizeToUse + "px " + fontStyle
                    ctx.fillStyle = color

                    //Draw text in center
                    ctx.fillText(txt, centerX, centerY)
                }
            }
        });

        const data = {
            labels: [
                'Act Prod (hour)',
                'Break (hour)',
                'Material (hour)',
                'Component (hour)',
                'Tooling (hour)',
                'Pallet (hour)',
                'Machine (hour)',
                'Kanban (hour)',
                'Man (hour)',
            ],
            datasets: [{
                data: series,
                // data: [
                // 	200, // Act Prod - blue
                // 	20, // Break - red
                // 	0, // Material - orange
                // 	10, // Component - limegreen
                // 	40, // Tooling - green
                // 	5, // Pallet - lightblue
                // 	8, // Machine - slightblue
                // 	9, // Kanban - darkblue
                // 	11, // Man - purple
                // ],
                backgroundColor: [
                    '#0070C0', // blue
                    '#C00000', // red
                    '#FFC000', // orange
                    '#92D050', // limegreen
                    '#00B050', // green
                    '#00B0F0', // lightblue
                    '#E800E8', // slightblue
                    '#002060', // darkblue
                    '#7030A0', // purple
                ],
                borderWidth: 0
            }],
        };

        const options = {
            title: {
                display: true,
                position: 'top',
                fontSize: 30,
                padding: 30,
                text: [
                    'Line ' + machine.line,
                    machine.name
                ],
                fontColor: '#FFFFFF'
            },
            legend: {
                display: false,
            },
            elements: {
                center: {
                    text: 'OEE ' + OEE + '%',
                    color: '#ffff00',
                    sidePadding: 10
                }
            },
            scales: {
                yAxes: [{
                    display: false,
                }]
            },
            responsive: false,
            maintainAspectRatio: false,
        };

        const chartLineI = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: options
        });
    }

    initHighcharts(container, time, actual, plan, animated = false) {
        return Highcharts.chart(container, {
			colors: ['#2f7ed8', '#c42525', '#0d233a', '#8bbc21', '#910000', '#1aadce','#492970', '#f28f43', '#77a1e5', '#a6c96a'],

            title: {
                text: null
            },

            subtitle: {
                text: null
            },

            yAxis: {
                title: {
                    text: null
                }
            },

            xAxis: {
                labels: {
                    style: {
                        fontSize: '7',
                        fontWeight: '100'
                    }
                },
                categories: time,
            },

            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 7.00
                }
            },

            legend: {
                align: 'center',
                verticalAlign: 'bottom',
                x: 0,
                y: 0
            },

            chart: {
                height: 500,
                spacingTop: 50,
                marginBottom: 100,
				animation : false,
            },

            lang: {
                numericSymbols: false
            },

            plotOptions: {
                line: {
                    marker: {
                        enabled: false,
                    }
                },
                series : {
					animation : false,
				},
            },

            credits: {
                enabled: false
            },

            series: [{
                    name: 'Plan',
                    data: plan.map(item => Math.round(item)),
                },
                {
                    name: 'Actual',
                    data: actual,
                    //~ lineColor: 'red',
                }
            ],

			annotations: [{
				labels: [
					{
						point: {
							x: 50,
							y: 10,
						},
						overflow: 'none',
						shape: 'rect',
						style: {
							color: '#2f7ed8',
							fontWeight: 'bold',
						},
						formatter: function() {
							let points = this.series.chart.series[0].points
							return 'Plan: ' + points[points.length - 1].y
						}
					},
					{
						point: {
							x: 130,
							y: 10,
						},
						style: {
							color: '#c42525',
							fontWeight: 'bold',
						},
						overflow: 'none',
						shape: 'rect',
						formatter: function() {
							let points = this.series.chart.series[1].points
							return 'Act: ' + points[points.length - 1].y
						}
					},
				],
			}],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }

        });

    }

    async generateChart(data = null, animated = false) {
        if (data) {
            const time = data.stats.map(item => item.time);
            const actual = data.stats.map(item => item.total.stroke);
            const target = data.stats.map(item => item.plan);
			const container = $(this.wrapperName).find('.chart-plan-actual')[0];

            this.initHighcharts(container, time, actual, target, animated);
        }
    }

	actualProductionStart(stats){
		const time = stats[0].time;

		for(const tmp of stats){
			if(tmp.total.pcs > 0){
				return tmp.time;
				break;
			}
		}

		return time;
	};

	getTimeDiffFromLastLog(lastLog){
		const __now = new Date();
		const __last = new Date(lastLog);

		return __now - __last;
	};

	setCurrentAbnormality(currentAbnormality = null, lastLog = null){
		const container = $(this.wrapperName).find('.downtime-notice');

		if(lastLog){
			const timeDiff = this.getTimeDiffFromLastLog(lastLog);
			const limit = 1; //in hour

			// if timeDiff is more than limit, then assume that machine is off
			if((timeDiff/3600000) > 1){
				$(this.wrapperName).find('.downtime-notice-timer').html('');
				$(this.wrapperName).find('.downtime-device').html('Machine is OFF');

				container.addClass('is-down');

				return true;
			}
		}

		if(currentAbnormality != null){
			const duration = currentAbnormality.duration.hms;
			$(this.wrapperName).find('.downtime-notice-timer').html('Downtime '+duration.h+':'+duration.m+':'+duration.s);
			$(this.wrapperName).find('.downtime-device').html(currentAbnormality.category+' - '+currentAbnormality.reason);

			container.addClass('is-down');

			return true;
		}
		else{
			$(this.wrapperName).find('.downtime-notice-timer').html('');
			$(this.wrapperName).find('.downtime-device').html('IN PRODUCTION');

			container.removeClass('is-down');

			return false;
		}
	};

    generateBOD(message) {
		const data = message.data;
		const len = data.stats.length - 1;
		const timeDiff = this.getTimeDiffFromLastLog(data.stats[len].range.finish) / 3600000; // in hour
		const limit = 15;

		const __chart = this.generateChart(data);

		$(this.wrapperName).find('.shift-date').html(window.date.format(new Date(data.stats[len].date), "DD MMM YYYY"));

		$(this.wrapperName).find('.planned-start').html(data.shift.plannedStart.slice(0,-3));
		$(this.wrapperName).find('.planned-end').html(data.shift.plannedFinish.slice(0,-3));

		$(this.wrapperName).find('.actual-start').html(this.actualProductionStart(data.stats));
		$(this.wrapperName).find('.actual-end').html(data.stats[len].time);

		$(this.wrapperName).find('.machine-line').html(data.machine.line);
		$(this.wrapperName).find('.machine-name').html(data.machine.name);

		$(this.wrapperName).find('.plan-act-proud-hour').html(data.abnormality.plan.production);
		$(this.wrapperName).find('.plan-break-hour').html(data.abnormality.plan.breaks);
		$(this.wrapperName).find('.gsph-stroke1').html(Math.round(data.abnormality.plan.GSPH));

		$(this.wrapperName).find('.shift-counter').html(data.stats[len].shiftNumber);
		// $(this.wrapperName).find('.value-oee').html(Math.round(data.summary.OEE));
		$(this.wrapperName).find('.gsph-stroke2').html(Math.round(data.summary.GSPH));
		$(this.wrapperName).find('.efficiency-counter').html(data.summary.efficiency.toFixed(2) + '%');

		const abnormality = [
			data.abnormality.actual.production ? data.abnormality.actual.production.minutes : 0,
			data.abnormality.actual.pause ? data.abnormality.actual.pause.minutes : 0,
			data.abnormality.actual.material ? data.abnormality.actual.material.minutes : 0,
			data.abnormality.actual.component ? data.abnormality.actual.component.minutes : 0,
			data.abnormality.actual.tooling ? data.abnormality.actual.tooling.minutes : 0,
			data.abnormality.actual.equipment ? data.abnormality.actual.equipment.minutes : 0,
			data.abnormality.actual.machine ? data.abnormality.actual.machine.minutes : 0,
			data.abnormality.actual.kanban ? data.abnormality.actual.kanban.minutes : 0,
			data.abnormality.actual.man ? data.abnormality.actual.man.minutes : 0,
			data.abnormality.actual.other ? data.abnormality.actual.other.minutes : 0,
		];

		let OEELabel;
		if (data.summary.OEE >= 85) {
			OEELabel = $(this.wrapperName).find('.labelling-excelent');
		} else if (data.summary.OEE > 40 && data.summary.OEE < 85) {
			OEELabel = $(this.wrapperName).find('.labelling-good');
		} else {
			OEELabel = $(this.wrapperName).find('.labelling-poor');
		}

		OEELabel.addClass('active');
		OEELabel.siblings().removeClass('active');

		this.initDoughnutChart('chart-line-h',data.machine, abnormality, Math.round(data.summary.OEE));

		$(this.wrapperName).find('.actual-act-proud-hour').html(abnormality[0]);
		$(this.wrapperName).find('.actual-break-hour').html(abnormality[1]);
		$(this.wrapperName).find('.actual-material-hour').html(abnormality[2]);
		$(this.wrapperName).find('.actual-component-hour').html(abnormality[3]);
		$(this.wrapperName).find('.actual-tooling-hour').html(abnormality[4]);
		$(this.wrapperName).find('.actual-pallet-hour').html(abnormality[5]);
		$(this.wrapperName).find('.actual-machine-hour').html(abnormality[6]);
		$(this.wrapperName).find('.actual-kanban-hour').html(abnormality[7]);
		$(this.wrapperName).find('.actual-man-hour').html(abnormality[8]);
		$(this.wrapperName).find('.actual-other-hour').html(abnormality[9]);

    };

	generateProdLine(data) {
        const lastIndex = data.shiftRecap.length - 1;

        $('#shift-date').html(date.format(new Date(data.shiftRecap[lastIndex].plan.time.date), "DD MMM YYYY"));
        $('#shift-time').html(data.shiftRecap[lastIndex].plan.time.start + ' - ' + date.format(new Date(data.shiftRecap[lastIndex].current.time.finish), 'HH:mm:ss'));

        $('#machine-line').html(data.machine.line);
        $('#machine-name').html(data.machine.name);

        $('#shift-target').html(data.shiftRecap[lastIndex].shift.total.target);
        $('#shift-actual').html(data.shiftRecap[lastIndex].shift.total.stroke);

        $('#current-plan').html(data.shiftRecap[lastIndex].current.total.target);
        $('#current-act').html(data.shiftRecap[lastIndex].current.total.stroke);

        $('#efficiency-shift-value').html(data.shiftRecap[lastIndex].shift.efficiency.value);
        $('#efficiency-current-value').html(data.shiftRecap[lastIndex].current.efficiency.value);
        $('#efficiency-current-percent').html(data.shiftRecap[lastIndex].current.efficiency.percent + ' %');
        $('#efficiency-shift-percent').html(data.shiftRecap[lastIndex].shift.efficiency.percent + ' %');

        $('#shift-operator').html(data.operator);

        $('#shift-number').html(data.shiftRecap[lastIndex].shiftNumber);
        $('#part-name').html(data.product.name);
        $('#part-number').html(data.product.number);
    };
}
