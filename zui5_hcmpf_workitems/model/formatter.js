sap.ui.define([], function(){
	"use strict"	
	return {
		dateText: function(dateText) {
			var newDate = new Date(dateText);
			var options = {month: 'short', day: 'numeric', year: 'numeric' };
			return newDate.toLocaleDateString('en-US', options);
		}
	}
	
});