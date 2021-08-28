/*!
 * ${copyright}
 */

sap.ui.define(['sap/ui/core/Renderer', 'sap/m/ToolbarRenderer'],
	function (Renderer, ToolbarRenderer) {
		"use strict";

		/**
		 * OverflowToolbar renderer.
		 * @namespace
		 */
		var HistoryToolbarRenderer = Renderer.extend(ToolbarRenderer);

		HistoryToolbarRenderer.renderBarContent = function (oRm, oToolbar) {
			var iPosition = 0;
			oToolbar._getVisibleContent().forEach(function (oControl) {
				// Added interpunct · between two text
				if (oControl instanceof sap.m.Text && iPosition > 0 && !sap.ui.Device.system.phone) {
					// oRm.openStart("span").openEnd();
					// oRm.text("\u00a0\u00a0\u00a0\u00B7\u00a0");
					// oRm.close("span");
					oRm.write("<span>&#160&#160&#160&#x00B7&#160&#160</span>");
				}
				sap.m.BarInPageEnabler.addChildClassTo(oControl, oToolbar);
				oRm.renderControl(oControl);
				iPosition++;
			});

			if (oToolbar._getOverflowButtonNeeded()) {
				HistoryToolbarRenderer.renderOverflowButton(oRm, oToolbar);
			}
		};

		HistoryToolbarRenderer.renderOverflowButton = function (oRm, oToolbar) {
			var oOverflowButton = oToolbar._getOverflowButton();
			sap.m.BarInPageEnabler.addChildClassTo(oOverflowButton, oToolbar);
			oRm.renderControl(oOverflowButton);
		};

		return HistoryToolbarRenderer;

	}, /* bExport= */ true);