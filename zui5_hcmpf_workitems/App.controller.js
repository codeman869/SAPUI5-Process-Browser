sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"jquery.sap.global"
], function(Controller, JSONModel, jQuery){
	
	return Controller.extend("zui5_hcmpf_workitems.App",{
		
		onInit: function() {
			//console.warn("Hi!");
			
			var oView = this.getView();
			
			var oModel = new JSONModel();
			
			if(jQuery.sap.getUriParameters().get('test') === 'X') {
				oModel.loadData('/zui5_hcmpf_workitems/data/user.json');
			} else {
				
				oModel.loadData("/ui5_workitems/user");
			}
						
			oView.setModel(oModel);

		}
		
	});
	
});


//sap.ui.controller("zui5_hcmpf_workitems.App", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hcmpf_workitems.App
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hcmpf_workitems.App
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hcmpf_workitems.App
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hcmpf_workitems.App
*/
//	onExit: function() {
//
//	}

//});