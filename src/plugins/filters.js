import Vue from 'vue';
import moment from 'moment';

Vue.filter('number', function (value, decimals, includeCommas = true) {
	if (isNaN(value)) return value;
	var x = Number(value).toFixed(decimals);
	if (includeCommas) {
		var parts = x.toString().split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	}
	return x;
});

Vue.filter('date', function (value, format = 'llll') {
	if (value) {
		return moment(String(value)).format(format);
	}
});

Vue.filter('dateFromNow', function (value) {
	if (value) {
		return moment(String(value)).fromNow();
	}
});

Vue.filter('ifnull', function (value, nullvalue) {
	if (value == '' || value == null || value == undefined)
		return nullvalue;

	return value;
});

Vue.directive('autofocus', {
	inserted: function (el, binding) {
		if (binding.value || binding.value == undefined) {
			el.focus();
		}
	}
});