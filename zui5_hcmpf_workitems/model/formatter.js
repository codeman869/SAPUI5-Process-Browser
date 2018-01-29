sap.ui.define([], function(){
	"use strict"	
	return {
		dateStatus: function(date) {
			var dateObj = new Date(date);
			var today = new Date();
			
			var threeDaysFromNow = new Date(Date.now()+3*(8.64e+7));
			if(dateObj<today) {
				return "Error";
			} else if (dateObj > threeDaysFromNow) {
				return "Success";
			} else {
				return "Warning";
			}

		},
		
		dateIcon: function(date) {
			var today = new Date();
			var dateObj = new Date(date);
			var threeDaysFromNow = new Date(Date.now()+3*(8.64e+7));
			var result = "";
			if (dateObj<today) {
				result = "sap-icon://alert";
			} else if (dateObj > threeDaysFromNow) {
				//result = "None";
			} else {
				result = "sap-icon://lateness";
			}
			return result;
		},
		
		prnFormatter: function(prn) {
			return prn.replace(/^0+/g, "");
		}
	}
	
});