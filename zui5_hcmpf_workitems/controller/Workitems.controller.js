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
	
	return Controller.extend("zui5_hcmpf_workitems.controller.Workitems", {
	/*
	Guard against bugs
	
	("`-''-/").___..--''"`-._
	 `6_ 6  )   `-.  (     ).`-.__.`)
	 (_Y_.)'  ._   )  `._ `. ``-..-'
	_..`--'_..-_/  /--'_.' ,'
   (il).-''  (li).'  ((!.-'
  
	*/
		formatter: formatter,
		oView: null,
		oTable: null,
		refreshButton: null, 
		busyIndicator: null,
		testStatus: false,
		
		onInit: function() {
			this.oView = this.getView();
			this.oTable = this.oView.byId("workItemsTable"); 
			this.refreshButton = this.oView.byId("refreshButton");
			this.busyIndicator = this.oView.byId("busyIndicator");
			this.testStatus = jQuery.sap.getUriParameters().get('test') === 'X';
			
			var oModel = new JSONModel();
			
			this.oView.setModel(oModel);
			this._fetchServerData();
			
		},
		
		handleViewSettings: function(oEvent) {
			if(!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("zui5_hcmpf_workitems.view.Dialog", this);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
			
		},
		
		setSorters: function(params) {
			
			var oBinding = this.oTable.getBinding("items");
			
			var aSorters = [];
			var sPath = params.sortItem.getKey();
			
			var bDescending = params.sortDescending;
			
			aSorters.push(new Sorter(sPath, bDescending));
			
			oBinding.sort(aSorters);

			
		},
		
		setFilters: function() {
			var aFilters = [];
			var filters = this._oDialog.getFilterItems();
			var oBinding = this.oTable.getBinding("items");
			
			//Goes through all the custom controls and creates a new filter to add
			// to the filter array and then binds those filters to the table.
			
			jQuery.each(filters, function(i,Item){
				var oCtrl = Item.getCustomControl();
				var value = oCtrl.getValue();
				
				if(value !== "") {
					
					var keyValues = Item.getKey().split("___");
					
					if(keyValues[0] === 'effDate') {
						//Special handling for the effective date filter
						var fromDate = oCtrl.getDateValue();
						var toDate = oCtrl.getSecondDateValue();
						
						var year = fromDate.getFullYear();
						var month = fromDate.getMonth() + 1 < 10 ? "0" + (fromDate.getMonth() + 1) : fromDate.getMonth() + 1;   
						var day = fromDate.getDate() < 10 ? "0" + fromDate.getDate() : fromDate.getDate();
						var sFromDate = year + "-"+month+"-"+day; 
						
						year = toDate.getFullYear();
						month = toDate.getMonth() + 1 < 10 ? "0" + (toDate.getMonth() + 1) : toDate.getMonth() + 1;   
						day = toDate.getDate() < 10 ? "0" + toDate.getDate() : toDate.getDate();
						var sToDate = year + "-" + month + "-" + day;

						
						var oFilter = new Filter(keyValues[0], 'BT', sFromDate, sToDate);
						
					} else {
						
						var oFilter = new Filter(keyValues[0], 'Contains', value + "");
					}
					
					aFilters.push(oFilter);
				}
			});
			
			oBinding.filter(aFilters);

			
		},
		
		handleConfirm: function(oEvent) {
			
			this.setSorters(oEvent.getParameters());
			this.setFilters();
			
		},
		
		onFilterWorkitems: function(oEvent) {
			//This handles the filtering function by the search bar
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if(sQuery) {
				
				var filters = [new Filter("title", FilterOperator.Contains, sQuery), new Filter("comments", FilterOperator.Contains, sQuery)]
				aFilter.push(new Filter(filters, false));
				
				
			}
			
			
			var oBinding = this.oTable.getBinding("items");
			oBinding.filter(aFilter);
			
		},
		
		onHandleRow: function(oEvent) {
			//This function launches the workitem in a new window 
			//var item = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
			var item = oEvent.getSource().getBindingContext().getObject();
			
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
			//This function handles the refresh button press and reloads the json model
		this._fetchServerData();	
		
		},
		
		_setStateRefreshing: function() {
			
			this.refreshButton.setVisible(false);
			this.busyIndicator.setVisible(true);

		},
		_setStateNormal: function() {
			
			this.refreshButton.setVisible(true);
			this.busyIndicator.setVisible(false);
		},

		_fetchServerData: function() {
			var oModel = this.getView().getModel();
			
			var that = this;

			this._setStateRefreshing();

			var headers = {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
					Expires: -1
						
			};
			
			if(this.testStatus) {
				
				setTimeout(function(){
					
					oModel.loadData("/zui5_hcmpf_workitems/data/forms.json");


					that._setStateNormal();

				}, 3000);
				
			} else {
				//Headers are used to force IE to refresh new data every time the refresh button is hit
				oModel.loadData("/ui5_workitems", "", true, "GET", false, false, headers);
				
			}
			
			oModel.attachRequestCompleted(function(){

				MessageToast.show("Data Loaded");
				that._setStateNormal();
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