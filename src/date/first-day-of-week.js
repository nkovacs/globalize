import dateWeekDays from "./week-days";

/**
 * firstDayOfWeek
 */
export default function( cldr ) {
	return dateWeekDays.indexOf( cldr.supplemental.weekData.firstDay() );
};
