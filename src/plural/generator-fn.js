import validateParameterPresence from "../common/validate/parameter-presence";
import validateParameterTypeNumber from "../common/validate/parameter-type/number";

export default function( plural ) {
	return function pluralGenerator( value, ord ) {
		validateParameterPresence( value, "value" );
		validateParameterTypeNumber( value, "value" );

		return plural( value, ord );
	};
};
