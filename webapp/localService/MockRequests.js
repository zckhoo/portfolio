// In mock mode, the mock server intercepts HTTP calls and provides fake output to the
// client without involving a backend system. But special backend logic, such as that
// performed by function imports, is not automatically known to the mock server. To handle
// such cases, the app needs to define specific mock requests that simulate the backend
// logic using standard HTTP requests (that are again interpreted by the mock server) as
// shown below.

// Please note:
// The usage of synchronous calls is only allowed in this context because the requests are
// handled by a latency-free client-side mock server. In production coding, asynchronous
// calls are mandatory.

sap.ui.define(["sap/ui/base/Object"], function (Object) {
	"use strict";

	var tempKey = "";

	return Object.extend("my.zckhoo.portfolio.localService.MockRequests", {
		constructor: function (oMockServer) {
			this._srvUrl = "/sap/opu/odata/sap/ZPROFILE_SRV/"; //service url
			this._bError = false; //true if a this._sjax request failed
			this._sErrorTxt = ""; //error text for the oXhr error respons
			this._oMockServer = oMockServer;
		},

		getRequests: function () {
			return [this.mockCreateApplication(), this.mockCreateAppConfig(), this.mockCreateVersion()];
		},

		getUrlParameter: function (sUrlParams, sName) {
			var aUrlParams = decodeURIComponent(sUrlParams).replace("?", "&").split("&"),
				aParameter;
			for (var i = 0; i < aUrlParams.length; i++) {
				aParameter = aUrlParams[i].split("=");
				if (aParameter[0] === sName) {
					return decodeURIComponent(aParameter[1]).replace(/^\'|\'$/g, "");
				}
			}
		},
		mockCreateApplication: function () {
			return {
				method: "POST",
				path: new RegExp("AppSet?(.*)"),
				response: this.createApplication.bind(this)
			};
		},
		createApplication: function (oXhr) {
			var sEntitySetName = "AppSet";

			tempKey = this.sNewRequestId = this.getNewGUID();
			var oEntity = this.initNewEntity(oXhr, sEntitySetName, {
				key: this.sNewRequestId
			});
			oEntity.createdOn = this.getCurrentDateTime(); //"/Date(" + (sDate.getTime()).toString() + ")/";
			oEntity.areaDesc = this.getDivisionText(oEntity.division);

			this.addEntityToMockData(sEntitySetName, oEntity);
			oXhr.respondJSON(201, {
				"Content-Type": "application/json;charset=utf-8"
			}, JSON.stringify({
				d: oEntity,
				uri: this.getUri(sEntitySetName, oEntity)
			}));
			return true;
		},

		mockCreateAppConfig: function () {
			return {
				method: "POST",
				path: new RegExp("AppConfigSet?(.*)"),
				response: this.createAppConfig.bind(this)
			};
		},
		createAppConfig: function (oXhr) {
			var sEntitySetName = "AppConfigSet",
				aConfigType = this._oMockServer.getEntitySetData("ConfigTypeSet"),
				sTypeDesc;
			this.sNewKey = this.getNewGUID();
			var oEntity = this.initNewEntity(oXhr, sEntitySetName, {
				key: this.sNewKey
			});
			oEntity.createdOn = this.getCurrentDateTime(); //"/Date(" + (sDate.getTime()).toString() + ")/";
			aConfigType.forEach(function (oType) {
				if (oType.key === oEntity.typeNode) {
					sTypeDesc = oType.typeDesc;
				}
			});
			oEntity.typeDesc = sTypeDesc;
			this.addEntityToMockData(sEntitySetName, oEntity);

			oXhr.respondJSON(201, {
				"Content-Type": "application/json;charset=utf-8"
			}, JSON.stringify({
				d: oEntity,
				uri: this.getUri(sEntitySetName, oEntity)
			}));
			return true;
		},

		mockCreateVersion: function () {
			return {
				method: "POST",
				path: new RegExp("ChangeLogSet?(.*)"),
				response: this.createVersion.bind(this)
			};
		},
		createVersion: function (oXhr) {
			var sEntitySetName = "ChangeLogSet";
			this.sNewKey = this.getNewGUID();
			var oEntity = this.initNewEntity(oXhr, sEntitySetName, {
				key: this.sNewKey
			});
			oEntity.createdOn = this.getCurrentDateTime(); //"/Date(" + (sDate.getTime()).toString() + ")/";
			oEntity.changedOn = this.getCurrentDateTime(); //"/Date(" + (sDate.getTime()).toString() + ")/";

			this.addEntityToMockData(sEntitySetName, oEntity);

			oXhr.respondJSON(201, {
				"Content-Type": "application/json;charset=utf-8"
			}, JSON.stringify({
				d: oEntity,
				uri: this.getUri(sEntitySetName, oEntity)
			}));
			return true;
		},

		mockDeleteRequest: function () {
			return {
				method: "POST",
				path: new RegExp("DeleteRequest?(.*)"),
				response: this.deleteRequest.bind(this)
			};
		},

		getCurrentDateTime: function () {
			var dDate = new Date();
			return "/Date(" + (dDate.getTime()).toString() + ")/";
		},

		deleteRequest: function (oXhr, sUrlParams) {
			var sEntitySetName = "OvertimeRequestSet";

			var aRequest = this._oMockServer.getEntitySetData(sEntitySetName),
				oRequest,
				bMatch = false;

			var sKey = this.getUrlParameter(sUrlParams, "Key"),
				sMessage = this.getUrlParameter(sUrlParams, "Message");

			for (var i in aRequest) {
				if (aRequest[i].Key === sKey) {
					aRequest[i].StatusID = "DELETE";
					aRequest[i].StatusText = "Deleted";
					aRequest[i].IsDeletable = false;
					oRequest = aRequest[i];
					bMatch = true;
					break;
				}
			}

			if (bMatch) {
				this.updateMockData(sEntitySetName, aRequest);
				oXhr.respond(200, {}, JSON.stringify({
					d: oRequest
				}));
			} else {
				oXhr.respond(400, null, "Failed to delete!");
			}
		},

		getDivisionText: function (sDivisionCode) {
			var aDivision = this._oMockServer.getEntitySetData("DivisionSet"),
				fnGetDivisionText = function (oData) {
					return oData.area === sDivisionCode;
				},
				sDivision;
			var aTemp = aDivision.filter(fnGetDivisionText);
			if (aTemp.length > 0) {
				sDivision = aTemp[0].areaDesc;
			}
			return sDivision;
		},

		getUri: function (sEntitySetName, oEntity) {
			return this._srvUrl + sEntitySetName + "(" + this._oMockServer._createKeysString(this._oMockServer._mEntitySets[sEntitySetName],
					oEntity) +
				")";
		},

		addEntityToMockData: function (sEntitySetName, oEntity) {
			this._oMockServer._oMockdata[sEntitySetName] = this._oMockServer._oMockdata[sEntitySetName].concat([oEntity]);
		},

		updateMockData: function (sEntitySetName, aArray) {
			this._oMockServer._oMockdata[sEntitySetName] = aArray;
		},

		initNewEntity: function (oXhr, sEntityName, oKeys) {
			var oEntity = JSON.parse(oXhr.requestBody);
			if (oEntity) {
				oKeys = oKeys || {};
				this._oMockServer._completeKey(this._oMockServer._mEntitySets[sEntityName], oKeys, oEntity);
				this._oMockServer._enhanceWithMetadata(this._oMockServer._mEntitySets[sEntityName], [oEntity]);
				return oEntity;
			}
			return null;
		},

		_getRequestBody: function (oXhr) {
			// returns the request body as a Json object
			var oXhrModel = new sap.ui.model.json.JSONModel();
			oXhrModel.setJSON(oXhr.requestBody);
			return oXhrModel.getData();
		},
		// Get New Request Id
		getNewGUID: function () {
			var sGuid = "",
				i = 0;
			while (i++ < 36) {
				var sChar = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx" [i - 1],
					sRandom = Math.random() * 16 | 0,
					sValue = sChar === "x" ? sRandom : (sRandom & 0x3 | 0x8);
				sGuid += (sChar === "-" || sChar === "4") ? sChar : sValue.toString(16);
			}
			return sGuid;
		}
	});
});