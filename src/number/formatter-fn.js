import validateParameterPresence from "../common/validate/parameter-presence";
import validateParameterTypeNumber from "../common/validate/parameter-type/number";
import numberFormat from "./format";

export default function( properties ) {
	return function numberFormatter( value ) {
		validateParameterPresence( value, "value" );
		validateParameterTypeNumber( value, "value" );

		return numberFormat( value, properties );
	};
};
