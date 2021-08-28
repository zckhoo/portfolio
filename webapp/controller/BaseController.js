sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/m/Panel",
	"sap/m/MessageBox",
	"sap/m/Text"
], function (Controller, History, JSONModel, Filter, Panel, MessageBox, Text) {
	"use strict";

	return Controller.extend("my.zckhoo.portfolio.controller.BaseController", {
		/**
		 * Convenient method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenient method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},

		/**
		 * Convenient method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getOwnerComponent().setModel(oModel, sName);
		},

		/**
		 * Convenient method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Convenient method for getting the resource bundle from common lib.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getCommonResourceBundle: function () {
			return sap.ui.getCore().getLibraryResourceBundle("de.conti.cgw.common");
		},

		/**
		 * Enhance current i18n model by an library i18n model.
		 * @public
		 * @param {string} enhancementComponentId component id for enhancement. E.g. "de.conti.cgw.common".
		 */
		enhanceResourceBundle: function (enhancementComponentId) {
			this.getModel("i18n").enhance(sap.ui.getCore().getLibraryResourceBundle(enhancementComponentId));
		},

		showError: function (response) {
			// create message panel
			var messagePanel = new Panel();
			messagePanel.addStyleClass("errorMessagePanel");
			// add error text to a panel
			messagePanel.addContent(new Text({
				text: this.getErrorMessage(response)
			}));
			// create tech detail panel with header text
			var techDetail = new Panel({
				headerText: "Expand for Tech Details"
			});
			var detailText = new Text();
			detailText.setText(response.responseText);
			var detailTextLabel = new sap.m.Label({
				text: "responseText"
			});
			detailTextLabel.setLabelFor(detailText);
			// add tech detail text
			techDetail.addContent(detailTextLabel);
			techDetail.addContent(detailText);
			techDetail.setExpandable(true);
			techDetail.setExpandAnimation(false);
			messagePanel.addContent(techDetail);

			MessageBox.error(messagePanel, {
				title: "Error"
			});

		},
		getErrorMessage: function (response, alternativeMessageId) {
			if (!alternativeMessageId) {
				alternativeMessageId = "commonErrorMessage";
			}

			var responseText = new JSONModel();
			responseText.setJSON(response.responseText);
			var errorData = responseText.getData();
			if (errorData.error) {
				if (errorData.error.innererror && errorData.error.innererror.errordetails) {
					for (var i = 0; i < errorData.error.innererror.errordetails.length; i++) {
						if (errorData.error.innererror.errordetails[i].severity == "error") {
							return errorData.error.innererror.errordetails[i].message;
						}
					}
				}
				return errorData.error.message.value;
			} else if (response.statusText) {
				return response.statusText;
			} else {
				return this.getResourceBundle().getText(alternativeMessageId);
			}
		},

		/**
		 * find the windows user id, which is logged on to the fiori launch pad.
		 * @public
		 */
		getUserId: function () {
			var userId;

			// try to get the user with FioriHub api
			if (sap.ushell.Container) {
				userId = sap.ushell.Container.getUser().getId();
			}

			// if no success with FioriHub api
			if (!userId) {
				// try to get user id with Cloud Platform API
				var userModel = new sap.ui.model.json.JSONModel();
				userModel.loadData("/services/userapi/currentUser", "", false);
				userId = userModel.getProperty("/name"); // <= this is the userId, not username !
			}

			return userId;
		},

		/** Function: showMessage
		 * This function will show MessageBox
		 * @param {string} sMessage - Message Content
		 * @param {string} sType - Message box type (E/S/W/I)
		 * @param {string} sTitle - Message Box Title
		 */
		showMessageBox: function (sMessage, sType, sTitle) {
			var oIcon;
			// Defind which Icon to use based on sType
			switch (sType) {
			case "E":
				oIcon = MessageBox.Icon.ERROR;
				break;
			case "S":
				oIcon = MessageBox.Icon.SUCCESS;
				break;
			case "W":
				oIcon = MessageBox.Icon.WARNING;
				break;
			case "I":
				oIcon = MessageBox.Icon.INFORMATION;
				break;
			default:
				oIcon = MessageBox.Icon.NONE;
				break;
			}
			MessageBox.show(sMessage, {
				icon: oIcon,
				title: sTitle,
				actions: MessageBox.Action.CLOSE,
				onClose: null
			});
		},

		/** 
		 * Show the Message Toast on screen
		 * @param {String} sMessage - Message inside msgToast
		 */
		messageToast: function (sMessage) {
			sap.m.MessageToast.show(sMessage, {
				duration: 4000,
				width: "20em",
				closeOnBrowserNavigation: false
			});
		}
	});
});