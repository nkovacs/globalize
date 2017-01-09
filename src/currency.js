import Globalize from "./core";
import runtimeBind from "./common/runtime-bind";
import validateCldr from "./common/validate/cldr";
import validateDefaultLocale from "./common/validate/default-locale";
import validateParameterPresence from "./common/validate/parameter-presence";
import validateParameterTypeCurrency from "./common/validate/parameter-type/currency";
import validateParameterTypeNumber from "./common/validate/parameter-type/number";
import validateParameterTypePlainObject from "./common/validate/parameter-type/plain-object";
import currencyCodeProperties from "./currency/code-properties";
import currencyFormatterFn from "./currency/formatter-fn";
import currencyNameProperties from "./currency/name-properties";
import currencySymbolProperties from "./currency/symbol-properties";
import objectOmit from "./util/object/omit";


import "./number";
import "cldr";
import "cldr/event";
import "cldr/supplemental";

function validateRequiredCldr( path, value ) {
	validateCldr( path, value, {
		skip: [ /supplemental\/currencyData\/fractions\/[A-Za-z]{3}$/ ]
	});
}

/**
 * .currencyFormatter( currency [, options] )
 *
 * @currency [String] 3-letter currency code as defined by ISO 4217.
 *
 * @options [Object]:
 * - style: [String] "symbol" (default), "accounting", "code" or "name".
 * - see also number/format options.
 *
 * Return a function that formats a currency according to the given options and default/instance
 * locale.
 */
Globalize.currencyFormatter =
Globalize.prototype.currencyFormatter = function( currency, options ) {
	var args, cldr, numberFormatter, pluralGenerator, properties, returnFn, style;

	validateParameterPresence( currency, "currency" );
	validateParameterTypeCurrency( currency, "currency" );

	validateParameterTypePlainObject( options, "options" );

	cldr = this.cldr;
	options = options || {};

	args = [ currency, options ];
	style = options.style || "symbol";

	validateDefaultLocale( cldr );

	// Get properties given style ("symbol" default, "code" or "name").
	cldr.on( "get", validateRequiredCldr );
	properties = ({
		accounting: currencySymbolProperties,
		code: currencyCodeProperties,
		name: currencyNameProperties,
		symbol: currencySymbolProperties
	}[ style ] )( currency, cldr, options );
	cldr.off( "get", validateRequiredCldr );

	// options = options minus style, plus raw pattern.
	options = objectOmit( options, "style" );
	options.raw = properties.pattern;

	// Return formatter when style is "symbol" or "accounting".
	if ( style === "symbol" || style === "accounting" ) {
		numberFormatter = this.numberFormatter( options );

		returnFn = currencyFormatterFn( numberFormatter );

		runtimeBind( args, cldr, returnFn, [ numberFormatter ] );

	// Return formatter when style is "code" or "name".
	} else {
		numberFormatter = this.numberFormatter( options );
		pluralGenerator = this.pluralGenerator();

		returnFn = currencyFormatterFn( numberFormatter, pluralGenerator, properties );

		runtimeBind( args, cldr, returnFn, [ numberFormatter, pluralGenerator, properties ] );
	}

	return returnFn;
};

Globalize.addMessageFormatterFunction( "currency", function( currency, style ) {
	var options = {};
	if ( style ) {
		options.style = style;
	}
	return this.currencyFormatter( currency, options );
});

/**
 * .currencyParser( currency [, options] )
 *
 * @currency [String] 3-letter currency code as defined by ISO 4217.
 *
 * @options [Object] see currencyFormatter.
 *
 * Return the currency parser according to the given options and the default/instance locale.
 */
Globalize.currencyParser =
Globalize.prototype.currencyParser = function( /* currency, options */ ) {

	// TODO implement parser.

};

/**
 * .formatCurrency( value, currency [, options] )
 *
 * @value [Number] number to be formatted.
 *
 * @currency [String] 3-letter currency code as defined by ISO 4217.
 *
 * @options [Object] see currencyFormatter.
 *
 * Format a currency according to the given options and the default/instance locale.
 */
Globalize.formatCurrency =
Globalize.prototype.formatCurrency = function( value, currency, options ) {
	validateParameterPresence( value, "value" );
	validateParameterTypeNumber( value, "value" );

	return this.currencyFormatter( currency, options )( value );
};

/**
 * .parseCurrency( value, currency [, options] )
 *
 * @value [String]
 *
 * @currency [String] 3-letter currency code as defined by ISO 4217.
 *
 * @options [Object]: See currencyFormatter.
 *
 * Return the parsed currency or NaN when value is invalid.
 */
Globalize.parseCurrency =
Globalize.prototype.parseCurrency = function( /* value, currency, options */ ) {
};

export default Globalize;
