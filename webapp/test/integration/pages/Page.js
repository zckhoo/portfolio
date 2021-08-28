sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";
	var sViewName = "Page";
	Opa5.createPageObjects({
		onTheAppPage: {

			actions: {},

			assertions: {

				iShouldSeeTheApp: function () {
					return this.waitFor({
						id: "app",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The Page view is displayed");
						},
						errorMessage: "Did not find the Page view"
					});
				}
			}
		}
	});

});