import dateStartOf from "./start-of";

/**
 * millisecondsInDay
 */
export default function( date ) {

	// TODO Handle daylight savings discontinuities
	return date - dateStartOf( date, "day" );
};
