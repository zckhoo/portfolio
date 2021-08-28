/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"my/zckhoo/portfolio/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});