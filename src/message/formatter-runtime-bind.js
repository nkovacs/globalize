define(function() {

return function( cldr, messageformatter, runtime, pluralLocales, embeddedFormatters ) {
	var origToString = messageformatter.toString;

	messageformatter.toString = function() {
		var argNames, argValues, output, locale,
			args = {};

		// Properly adjust SlexAxton/messageformat.js compiled variables with Globalize variables:
		output = origToString.call( messageformatter );

		if ( runtime.number ) {
			args.number = "messageFormat.number";
		}

		if ( runtime.plural ) {
			args.plural = "messageFormat.plural";
		}

		if ( runtime.select ) {
			args.select = "messageFormat.select";
		}

		if ( embeddedFormatters.length ) {
			args.fmt = "[" + embeddedFormatters.map( function( fn ) {
				return fn.generatorString();
			} ).join( ", " ) + "]";
		}

		for ( locale in pluralLocales ) {
			args[locale] = "Globalize(\"" + locale + "\")." +
				"pluralGenerator( { type: \"both\" } )";
		}

		argNames = Object.keys( args ).join( ", " );
		argValues = Object.keys( args ).map(function( key ) {
			return args[ key ];
		}).join( ", " );

		return "(function( " + argNames + " ) {\n" +
			"  return " + output + "\n" +
			"})(" + argValues + ")";
	};

	return messageformatter;
};

});
