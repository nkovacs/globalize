import numberNumberingSystem from "./numbering-system";
import createErrorUnsupportedFeature from "../common/create-error/unsupported-feature";

/**
 * nuMap( cldr )
 *
 * @cldr [Cldr instance].
 *
 * Return digits map if numbering system is different than `latn`.
 */
export default function( cldr ) {
	var aux,
		nu = numberNumberingSystem( cldr );

	if ( nu === "latn" ) {
		return;
	}

	aux = cldr.supplemental([ "numberingSystems", nu ]);

	if ( aux._type !== "numeric" ) {
		throw createErrorUnsupportedFeature( "`" + aux._type + "` numbering system" );
	}

	return aux._digits;
};
