import currencyCodeProperties from "./code-properties";
import objectFilter from "../util/object/filter";

/**
 * nameProperties( currency, cldr )
 *
 * Return number pattern with the appropriate currency code in as literal.
 */
export default function( currency, cldr ) {
	var properties = currencyCodeProperties( currency, cldr );

	properties.displayNames = objectFilter( cldr.main([
		"numbers/currencies",
		currency
	]), /^displayName/ );

	return properties;
};
