import numberSymbolName from "./name";
import numberSymbol from "../symbol";

/**
 * symbolMap( cldr )
 *
 * @cldr [Cldr instance].
 *
 * Return the (localized symbol, pattern symbol) key value pair, eg. {
 *   "٫": ".",
 *   "٬": ",",
 *   "٪": "%",
 *   ...
 * };
 */
export default function( cldr ) {
	var symbol,
		symbolMap = {};

	for ( symbol in numberSymbolName ) {
		symbolMap[ numberSymbol( numberSymbolName[ symbol ], cldr ) ] = symbol;
	}

	return symbolMap;
};
