import Cldr from "cldr";

import createError from "./common/create-error";
import formatMessage from "./common/format-message";
import runtimeBind from "./common/runtime-bind";
import validate from "./common/validate";
import validateCldr from "./common/validate/cldr";
import validateDefaultLocale from "./common/validate/default-locale";
import validateParameterPresence from "./common/validate/parameter-presence";
import validateParameterRange from "./common/validate/parameter-range";
import validateParameterType from "./common/validate/parameter-type";
import validateParameterTypeLocale from "./common/validate/parameter-type/locale";
import validateParameterTypePlainObject from "./common/validate/parameter-type/plain-object";
import alwaysArray from "./util/always-array";
import alwaysCldr from "./util/always-cldr";
import isPlainObject from "./util/is-plain-object";
import objectExtend from "./util/object/extend";
import regexpEscape from "./util/regexp/escape";
import stringPad from "./util/string/pad";

import "cldr/event";

function validateLikelySubtags( cldr ) {
	cldr.once( "get", validateCldr );
	cldr.get( "supplemental/likelySubtags" );
}

/**
 * [new] Globalize( locale|cldr )
 *
 * @locale [String]
 *
 * @cldr [Cldr instance]
 *
 * Create a Globalize instance.
 */
function Globalize( locale ) {
	if ( !( this instanceof Globalize ) ) {
		return new Globalize( locale );
	}

	validateParameterPresence( locale, "locale" );
	validateParameterTypeLocale( locale, "locale" );

	this.cldr = alwaysCldr( locale );

	validateLikelySubtags( this.cldr );
}

/**
 * Globalize.load( json, ... )
 *
 * @json [JSON]
 *
 * Load resolved or unresolved cldr data.
 * Somewhat equivalent to previous Globalize.addCultureInfo(...).
 */
Globalize.load = function() {

	// validations are delegated to Cldr.load().
	Cldr.load.apply( Cldr, arguments );
};

/**
 * Globalize.locale( [locale|cldr] )
 *
 * @locale [String]
 *
 * @cldr [Cldr instance]
 *
 * Set default Cldr instance if locale or cldr argument is passed.
 *
 * Return the default Cldr instance.
 */
Globalize.locale = function( locale ) {
	validateParameterTypeLocale( locale, "locale" );

	if ( arguments.length ) {
		this.cldr = alwaysCldr( locale );
		validateLikelySubtags( this.cldr );
	}
	return this.cldr;
};

Globalize._messageFmts = {};

Globalize.addMessageFormatterFunction = function( name, fn ) {
	Globalize._messageFmts[name] = fn;
};

/**
 * Optimization to avoid duplicating some internal functions across modules.
 */
Globalize._alwaysArray = alwaysArray;
Globalize._createError = createError;
Globalize._formatMessage = formatMessage;
Globalize._isPlainObject = isPlainObject;
Globalize._objectExtend = objectExtend;
Globalize._regexpEscape = regexpEscape;
Globalize._runtimeBind = runtimeBind;
Globalize._stringPad = stringPad;
Globalize._validate = validate;
Globalize._validateCldr = validateCldr;
Globalize._validateDefaultLocale = validateDefaultLocale;
Globalize._validateParameterPresence = validateParameterPresence;
Globalize._validateParameterRange = validateParameterRange;
Globalize._validateParameterTypePlainObject = validateParameterTypePlainObject;
Globalize._validateParameterType = validateParameterType;

export default Globalize;
