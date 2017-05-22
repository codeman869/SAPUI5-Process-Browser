sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"jquery.sap.global",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"zui5_hcmpf_workitems/model/formatter"
], function(Controller, JSONModel, Sorter, Filter, jQuery, FilterOperator, MessageToast, formatter){
	
	return Controller.extend("zui5_hcmpf_workitems.view.Workitems", {
		
		formatter: formatter,
		
		onInit: function() {
			
			
			var oModel = new JSONModel();
			
			if(jQuery.sap.getUriParameters().get('test') === 'X') {
			
				oModel.loadData("/zui5_hcmpf_workitems/data/forms.json");
				
			} else {
				
				oModel.loadData("/ui5_workitems");
				
			}
			
			this.getView().setModel(oModel);
			
		},
		
		handleViewSettings: function(oEvent) {
			if(!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("zui5_hcmpf_workitems.view.Dialog", this);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
			
		},
		
		handleConfirm: function(oEvent) {
			//console.log("Changing View Settings")
			
			var oView = this.getView();
			
			var oTable = oView.byId("workItemsTable");
			
			var oBinding = oTable.getBinding("items");
			var mParams = oEvent.getParameters();
			
			var aSorters = [];
			var sPath = mParams.sortItem.getKey();
			
			var bDescending = mParams.sortDescending;
			
			aSorters.push(new Sorter(sPath, bDescending));
			
			oBinding.sort(aSorters);
			
			//MessageToast.show(oEvent.getParameters());
			
			var aFilters = [];
			var filters = this._oDialog.getFilterItems();
			
			jQuery.each(filters, function(i,Item){
				var value = Item.getCustomControl().getValue();
				if(value !== "") {
					//console.log(Item.getKey());
					
					var keyValues = Item.getKey().split("___");
					
					var oFilter = new Filter(keyValues[0], 'Contains', value + "");
					//console.log()
					aFilters.push(oFilter);
				}
			});
			
			oBinding.filter(aFilters);
			
		},
		
		onPernrFilterChange: function(oEvent) {
			/*
			var oNewValue = oEvent.getParameter("value");
			var oCustomFilter = this._oDialog.getFilterItems()[0];
			
			oCustomFilter.setFilterCount(1);
			oCustomFilter.setSelected(true);
			
			
			this.pernrFilterValue = oNewValue;
			*/
			
			
			//console.log(oNewValue);
			
		},
		
		onFilterWorkitems: function(oEvent) {
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if(sQuery) {
				//console.log(sQuery);
				var filters = [new Filter("title", FilterOperator.Contains, sQuery), new Filter("comments", FilterOperator.Contains, sQuery)]
				aFilter.push(new Filter(filters, false));
				//aFilter.push();
				
			}
			
			var oList = this.getView().byId("workItemsTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
			
		},
		
		onHandleRow: function(oEvent) {
			var item = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
			
			jQuery.ajax({
				type: "GET",
				url: "/ui5_workitems/url/" + item.instId
				
			}).then(function(data){
				
				//console.log(data);
				window.open(data);
				jQuery.sap.log.info("Opened a new window to form with WIID: " + item.instId);
			}).fail(function(err) {
				
				jQuery.sap.log.error(err);
				
			});
			
			
			
			
			
		},
		
		onHandleRefresh: function(oEvent) {
			var oModel = this.getView().getModel();
			var headers = {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
					Expires: -1
						
			};
			
			if(jQuery.sap.getUriParameters().get('test') === 'X') {
				
				oModel.loadData("/zui5_hcmpf_workitems/data/forms.json");
				
				
			} else {
				
				//Headers are used to force IE to refresh new data every time the refresh button is hit
				
				oModel.loadData("/ui5_workitems", "", true, "GET", false, false, headers);
				
			}
			
			oModel.attachRequestCompleted(function(){
				MessageToast.show("Data Refreshed");
			});
			
		}
		
	});
	
});


//sap.ui.controller("zui5_hcmpf_workitems.view.Workitems", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hcmpf_workitems.view.Workitems
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hcmpf_workitems.view.Workitems
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hcmpf_workitems.view.Workitems
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hcmpf_workitems.view.Workitems
*/
//	onExit: function() {
//
//	}

//});