sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent){
	
	return UIComponent.extend("zui5_hcmpf_workitems.component.Component", {
		
		metadata: {
			rootView: "zui5_hcmpf_workitems.App"
		},
		
		init: function() {
			UIComponent.prototype.init.apply(this,arguments);
		}
		
	});
	
});