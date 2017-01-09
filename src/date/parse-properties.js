/**
 * parseProperties( cldr )
 *
 * @cldr [Cldr instance].
 *
 * Return parser properties.
 */
export default function( cldr ) {
	return {
		preferredTimeData: cldr.supplemental.timeData.preferred()
	};
};
