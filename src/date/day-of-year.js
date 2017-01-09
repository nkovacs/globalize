import dateDistanceInDays from "./distance-in-days";
import dateStartOf from "./start-of";

/**
 * dayOfYear
 *
 * Return the distance in days of the date to the begin of the year [0-d].
 */
export default function( date ) {
	return Math.floor( dateDistanceInDays( dateStartOf( date, "year" ), date ) );
};
