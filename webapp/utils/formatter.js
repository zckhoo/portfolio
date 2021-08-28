// Utility for formatting values

sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function (DateFormat) {

	"use strict";

	var fnMonthYearFormatter = DateFormat.getDateInstance({
		pattern: "MMM-yyyy",
		UTC: false
	});
	
	var fnDateFormatter = DateFormat.getDateInstance({
		pattern: "dd-MMM-yyyy",
		UTC: false
	});

	var me = {
		defaultMonthYearFormat: function (dDate) {
			if (!dDate) {
				return "";
			}
			var sDate = fnMonthYearFormatter.format(dDate);
			return sDate;
		},
		defaultDateFormat: function (dDate) {
			if (!dDate) {
				return "";
			}
			var sDate = fnDateFormatter.format(dDate);
			return sDate;
		},

		calculateYear: function (sBeginYear, sEndYear) {
			var iYearCount = 0;
			if (!sEndYear) {
				iYearCount = new Date().getUTCFullYear() - parseInt(sBeginYear, 0);
			} else {
				iYearCount = parseInt(sEndYear, 0) - parseInt(sBeginYear, 0);
			}
			return iYearCount;
		},
		
		certificateLink: function(sLink) {
			var sUrl = "-";
			if (sLink) {
				sUrl = sLink;
			}
			return sUrl;
		}
		
	};
	return me;
});