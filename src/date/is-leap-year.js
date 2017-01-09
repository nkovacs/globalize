/**
 * isLeapYear( year )
 *
 * @year [Number]
 *
 * Returns an indication whether the specified year is a leap year.
 */
export default function( year ) {
	return new Date( year, 1, 29 ).getMonth() === 1;
};
