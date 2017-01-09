import validateParameterPresence from "../common/validate/parameter-presence";
import validateParameterTypeNumber from "../common/validate/parameter-type/number";
import currencyNameFormat from "./name-format";

export default function( numberFormatter, pluralGenerator, properties ) {
	var fn;

	// Return formatter when style is "code" or "name".
	if ( pluralGenerator && properties ) {
		fn = function currencyFormatter( value ) {
			validateParameterPresence( value, "value" );
			validateParameterTypeNumber( value, "value" );
			return currencyNameFormat(
				numberFormatter( value ),
				pluralGenerator( value ),
				properties
			);
		};

	// Return formatter when style is "symbol" or "accounting".
	} else {
		fn = function currencyFormatter( value ) {
			return numberFormatter( value );
		};
	}

	return fn;
};
