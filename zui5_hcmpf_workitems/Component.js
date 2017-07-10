sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent){
	
	return UIComponent.extend("zui5_hcmpf_workitems.Component", {
		
		metadata: {
			manifest: "json"
		},
		
		init: function() {
			UIComponent.prototype.init.apply(this,arguments);
		}
		
	});
	
});