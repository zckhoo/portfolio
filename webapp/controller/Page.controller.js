sap.ui.define([
	"my/zckhoo/portfolio/controller/BaseController",
	"sap/m/library",
	"my/zckhoo/portfolio/utils/formatter"
], function (Controller, MobileLibrary, formatter) {
	"use strict";

	var URLHelper = MobileLibrary.URLHelper;
	return Controller.extend("my.zckhoo.portfolio.controller.Page", {

		formatter: formatter,

		onInit: function () {
			this.byId("idThemeSegment").setSelectedKey("Light");
			if (new Date().getHours() > 18) {
				this.byId("idThemeSegment").setSelectedKey("Dark");
				sap.ui.getCore().applyTheme("sap_fiori_3_dark");
			} else if (new Date().getHours() > 6) {
				sap.ui.getCore().applyTheme("sap_fiori_3");
			} else {
				this.byId("idThemeSegment").setSelectedKey("Dark");
				sap.ui.getCore().applyTheme("sap_fiori_3_dark");
			}
		},

		onSelectionChangeTheme: function (oEvent) {
			var sSelectedTheme = oEvent.getParameter("item").getKey();
			if (sSelectedTheme === "Light") {
				sap.ui.getCore().applyTheme("sap_fiori_3");
			} else {
				sap.ui.getCore().applyTheme("sap_fiori_3_dark");
			}
		},

		onPressPhone: function () {
			var sPhone = this.getModel("appModel").getProperty("/profileData/phone");
			URLHelper.triggerTel(sPhone);
		},

		onPressWhatsApp: function () {
			var sPhone = this.getModel("appModel").getProperty("/profileData/phone"),
				sFirstName = this.getModel("appModel").getProperty("/profileData/firstName"),
				sApi = "https://api.whatsapp.com/send?phone=";
			URLHelper.redirect(sApi + sPhone + "&text=Hi%20" + sFirstName, true);
		},

		onPressEmail: function (oEvent) {
			var sEmail = this.getModel("appModel").getProperty("/profileData/email");
			URLHelper.triggerEmail(sEmail, "Project Enquiry");
		},

		onPressCertificate: function (oEvent) {
			var sEmail = this.getModel("appModel").getProperty("/profileData/email");
			URLHelper.triggerEmail(sEmail, "Send me a copy of latest resume");
		}
	});
});