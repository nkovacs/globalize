import Globalize from "./core";
import createErrorUnsupportedFeature from "./common/create-error/unsupported-feature";
import runtimeBind from "./common/runtime-bind";
import validateCldr from "./common/validate/cldr";
import validateDefaultLocale from "./common/validate/default-locale";
import validateParameterPresence from "./common/validate/parameter-presence";
import validateParameterRange from "./common/validate/parameter-range";
import validateParameterTypeNumber from "./common/validate/parameter-type/number";
import validateParameterTypePlainObject from "./common/validate/parameter-type/plain-object";
import validateParameterTypeString from "./common/validate/parameter-type/string";
import numberFormatterFn from "./number/formatter-fn";
import numberFormatProperties from "./number/format-properties";
import numberNumberingSystem from "./number/numbering-system";
import numberParserFn from "./number/parser-fn";
import numberParseProperties from "./number/parse-properties";
import numberPattern from "./number/pattern";
import numberSymbol from "./number/symbol";
import removeLiteralQuotes from "./util/remove-literal-quotes";
import stringPad from "./util/string/pad";

import "cldr";
import "cldr/event";
import "cldr/supplemental";

function validateDigits( properties ) {
	var minimumIntegerDigits = properties[ 2 ],
		minimumFractionDigits = properties[ 3 ],
		maximumFractionDigits = properties[ 4 ],
		minimumSignificantDigits = properties[ 5 ],
		maximumSignificantDigits = properties[ 6 ];

	// Validate significant digit format properties
	if ( !isNaN( minimumSignificantDigits * maximumSignificantDigits ) ) {
		validateParameterRange( minimumSignificantDigits, "minimumSignificantDigits", 1, 21 );
		validateParameterRange( maximumSignificantDigits, "maximumSignificantDigits",
			minimumSignificantDigits, 21 );

	} else if ( !isNaN( minimumSignificantDigits ) || !isNaN( maximumSignificantDigits ) ) {
		throw new Error( "Neither or both the minimum and maximum significant digits must be " +
			"present" );

	// Validate integer and fractional format
	} else {
		validateParameterRange( minimumIntegerDigits, "minimumIntegerDigits", 1, 21 );
		validateParameterRange( minimumFractionDigits, "minimumFractionDigits", 0, 20 );
		validateParameterRange( maximumFractionDigits, "maximumFractionDigits",
			minimumFractionDigits, 20 );
	}
}

/**
 * .numberFormatter( [options] )
 *
 * @options [Object]:
 * - style: [String] "decimal" (default) or "percent".
 * - see also number/format options.
 *
 * Return a function that formats a number according to the given options and default/instance
 * locale.
 */
Globalize.numberFormatter =
Globalize.prototype.numberFormatter = function( options ) {
	var args, cldr, pattern, properties, returnFn;

	validateParameterTypePlainObject( options, "options" );

	options = options || {};
	cldr = this.cldr;

	args = [ options ];

	validateDefaultLocale( cldr );

	cldr.on( "get", validateCldr );

	if ( options.raw ) {
		pattern = options.raw;
	} else {
		pattern = numberPattern( options.style || "decimal", cldr );
	}

	properties = numberFormatProperties( pattern, cldr, options );

	cldr.off( "get", validateCldr );

	validateDigits( properties );

	returnFn = numberFormatterFn( properties );

	runtimeBind( args, cldr, returnFn, [ properties ] );

	return returnFn;
};

Globalize.addMessageFormatterFunction( "number", function( style ) {
	var options = {};
	if ( style ) {
		options.style = style;
	}
	return this.numberFormatter( options );
});

/**
 * .numberParser( [options] )
 *
 * @options [Object]:
 * - style: [String] "decimal" (default) or "percent".
 *
 * Return the number parser according to the default/instance locale.
 */
Globalize.numberParser =
Globalize.prototype.numberParser = function( options ) {
	var args, cldr, pattern, properties, returnFn;

	validateParameterTypePlainObject( options, "options" );

	options = options || {};
	cldr = this.cldr;

	args = [ options ];

	validateDefaultLocale( cldr );

	cldr.on( "get", validateCldr );

	if ( options.raw ) {
		pattern = options.raw;
	} else {
		pattern = numberPattern( options.style || "decimal", cldr );
	}

	properties = numberParseProperties( pattern, cldr, options );

	cldr.off( "get", validateCldr );

	returnFn = numberParserFn( properties );

	runtimeBind( args, cldr, returnFn, [ properties ] );

	return returnFn;
};

/**
 * .formatNumber( value [, options] )
 *
 * @value [Number] number to be formatted.
 *
 * @options [Object]: see number/format-properties.
 *
 * Format a number according to the given options and default/instance locale.
 */
Globalize.formatNumber =
Globalize.prototype.formatNumber = function( value, options ) {
	validateParameterPresence( value, "value" );
	validateParameterTypeNumber( value, "value" );

	return this.numberFormatter( options )( value );
};

/**
 * .parseNumber( value [, options] )
 *
 * @value [String]
 *
 * @options [Object]: See numberParser().
 *
 * Return the parsed Number (including Infinity) or NaN when value is invalid.
 */
Globalize.parseNumber =
Globalize.prototype.parseNumber = function( value, options ) {
	validateParameterPresence( value, "value" );
	validateParameterTypeString( value, "value" );

	return this.numberParser( options )( value );
};

/**
 * Optimization to avoid duplicating some internal functions across modules.
 */
Globalize._createErrorUnsupportedFeature = createErrorUnsupportedFeature;
Globalize._numberNumberingSystem = numberNumberingSystem;
Globalize._numberPattern = numberPattern;
Globalize._numberSymbol = numberSymbol;
Globalize._removeLiteralQuotes = removeLiteralQuotes;
Globalize._stringPad = stringPad;
Globalize._validateParameterTypeNumber = validateParameterTypeNumber;
Globalize._validateParameterTypeString = validateParameterTypeString;

export default Globalize;
