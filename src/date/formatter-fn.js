import validateParameterPresence from "../common/validate/parameter-presence";
import validateParameterTypeDate from "../common/validate/parameter-type/date";
import dateFormat from "./format";

export default function( numberFormatters, properties ) {
	return function dateFormatter( value ) {
		validateParameterPresence( value, "value" );
		validateParameterTypeDate( value, "value" );

		return dateFormat( value, numberFormatters, properties );
	};

};
