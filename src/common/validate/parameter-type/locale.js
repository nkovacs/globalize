import Cldr from "cldr";
import validateParameterType from "../parameter-type";

export default function( value, name ) {
	validateParameterType(
		value,
		name,
		value === undefined || typeof value === "string" || value instanceof Cldr,
		"String or Cldr instance"
	);
};
