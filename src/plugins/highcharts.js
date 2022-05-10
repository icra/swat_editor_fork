import Vue from 'vue';

import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import offlineExportInit from 'highcharts/modules/offline-exporting';
import mapInit from 'highcharts/modules/map';

Vue.use(HighchartsVue);
Highcharts.setOptions({
	chart: {
		style: {
			fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif'
		}
	},
	lang: {
		thousandsSep: '\u002c'
	},
	title: {
        style: {
			fontSize: '16px',
			fontWeight: 'bold'
        }
    }
});
HighchartsMore(Highcharts);
exportingInit(Highcharts);
exportDataInit(Highcharts);
offlineExportInit(Highcharts);
mapInit(Highcharts);

(function (H) {
	H.addEvent(H.Axis, 'init', function (e) {
		this.allowNegativeLog = e.userOptions.allowNegativeLog;
	});

	// Override conversions
	H.wrap(H.Axis.prototype, 'log2lin', function (proceed, num) {

		if (!this.allowNegativeLog) {
			return proceed.call(this, num);
		}

		var isNegative = num < 0,
			adjustedNum = Math.abs(num),
			result;
		if (adjustedNum < 10) {
			adjustedNum += (10 - adjustedNum) / 10;
		}
		result = Math.log(adjustedNum) / Math.LN10;
		return isNegative ? -result : result;
	});
	H.wrap(H.Axis.prototype, 'lin2log', function (proceed, num) {
		if (!this.allowNegativeLog) {
			return proceed.call(this, num);
		}

		var isNegative = num < 0,
			absNum = Math.abs(num),
			result = Math.pow(10, absNum);
		if (result < 10) {
			result = (10 * (result - 1)) / (10 - 1);
		}
		return isNegative ? -result : result;
	});
}(Highcharts));
