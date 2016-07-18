define([
	"globalize",
	"json!cldr-data/supplemental/likelySubtags.json",
	"json!cldr-data/supplemental/plurals.json",
	"json!cldr-data/supplemental/ordinals.json",
	"../../util",

	"cldr/unresolved",
	"globalize/message",
	"globalize/plural"
], function( Globalize, likelySubtags, plurals, ordinals, util ) {

QUnit.assert.messageFormatter = function( locale, path, variables, expected ) {
	if ( arguments.length === 3 ) {
		expected = variables;
		variables = undefined;
	}
	this.equal( Globalize( locale ).messageFormatter( path )( variables ), expected );
};

QUnit.assert.messageBundlePresence = function( fn ) {
	this.throws( fn, function E_MISSING_MESSAGE_BUNDLE( error ) {
		return error.code === "E_MISSING_MESSAGE_BUNDLE" &&
			"locale" in error;
	}, "Expected \"E_MISSING_MESSAGE_BUNDLE\" to be thrown" );
};

QUnit.module( ".messageFormatter( path )", {
	setup: function() {
		Globalize.load( likelySubtags );
		Globalize.load( plurals );
		Globalize.load( ordinals );
		Globalize.loadMessages({
			root: {
				amen: "Amen"
			},
			de: {},
			en: {
				greetings: {
					hello: "Hello",
					helloArray: "Hello, {0}",
					helloArray2: "Hello, {0} and {1}",
					helloName: "Hello, {name}"
				},
				like: [
					"{count, plural, offset:1",
					"     =0 {Be the first to like this}",
					"     =1 {You liked this}",
					"    one {You and {someone} liked this}",
					"  other {You and # others liked this}",
					"}"
				],
				party: [
					"{hostGender, select,",
					"  female {{host} invites {guest} to her party}",
					"    male {{host} invites {guest} to his party}",
					"   other {{host} invites {guest} to their party}",
					"}"
				],
				task: [
					"You have {0, plural,",
					"    one {one task}",
					"  other {# tasks}",
					"} remaining"
				],
				ordinal: [
					"{cat, selectordinal, one{#st} two{#nd} few{#rd} other{#th} }",
					"category"
				],
			},
			"en-GB": {},
			fr: {},
			he: {
				helloArray: "Hello, {0} & {1}"
			},
			pt: {
				amen: "Amém"
			},
			"pt-PT": {},
			zh: {
				amen: "阿门"
			}
		});
	},
	teardown: util.resetCldrContent
});

QUnit.test( "should pass test's prerequisites", function( assert ) {
	var sr = new Globalize( "sr" );

	// OBS: Ensure `sr` cldr/main dataset hasn't being loaded elsewhere. It's a prerequisites for
	// the below messageBundlePresence test.
	assert.deepEqual( sr.cldr.attributes.bundle, null, "`sr` cldr/main dataset cannot be loaded" );
});

QUnit.test( "should validate parameters", function( assert ) {
	util.assertParameterPresence( assert, "path", function() {
		Globalize( "en" ).messageFormatter();
	});

	util.assertPathParameter( assert, "path", function( invalidValue ) {
		return function() {
			Globalize( "en" ).messageFormatter( invalidValue );
		};
	});
});

QUnit.test( "should validate messages", function( assert ) {
	assert.messageBundlePresence(function() {
		Globalize( "sr" ).messageFormatter( "path" );
	});

	util.assertMessagePresence( assert, "non-existent/path", function() {
		Globalize( "en" ).messageFormatter( "non-existent/path" );
	});

	util.assertMessageType( assert, "invalid-message", function( invalidValue ) {
		Globalize.loadMessages({
			en: {
				"invalid-message": invalidValue
			}
		});
		return function() {
			Globalize( "en" ).messageFormatter( "invalid-message" );
		};
	});
});

QUnit.test( "should return the loaded translation", function( assert ) {
	assert.messageFormatter( "pt", "amen", "Amém" );
	assert.messageFormatter( "zh", "amen", "阿门" );
});

QUnit.test( "should traverse the translation data", function( assert ) {
	assert.messageFormatter( "en", "greetings/hello", "Hello" );
	assert.messageFormatter( "en", [ "greetings", "hello" ], "Hello" );
});

QUnit.test( "should return inherited translation if cldr/unresolved is loaded", function( assert ) {
	assert.messageFormatter( "en", "amen", "Amen" );
	assert.messageFormatter( "de", "amen", "Amen" );
	assert.messageFormatter( "en-GB", "amen", "Amen" );
	assert.messageFormatter( "fr", "amen", "Amen" );
	assert.messageFormatter( "pt-PT", "amen", "Amém" );
});

QUnit.test( "should support ICU message format", function( assert ) {
	var like;

	// Var replacement
	assert.messageFormatter( "en", "greetings/helloArray", [ "Beethoven" ], "Hello, Beethoven" );
	assert.messageFormatter( "en", "greetings/helloArray", "Beethoven", "Hello, Beethoven" );
	assert.messageFormatter( "en", "greetings/helloArray2", [ "Beethoven", "Mozart" ],
		"Hello, Beethoven and Mozart" );
	assert.messageFormatter( "en", "greetings/helloName", {
		name: "Beethoven"
	}, "Hello, Beethoven" );

	// Plural
	assert.messageFormatter( "en", "task", 123, "You have 123 tasks remaining" );

	// Select
	assert.messageFormatter( "en", "party", {
		guest: "Mozart",
		host: "Beethoven",
		hostGender: "male"
	}, "Beethoven invites Mozart to his party" );

	// Plural offset
	like = new Globalize( "en" ).messageFormatter( "like" );
	assert.equal( like({ count: 0 }), "Be the first to like this" );

	assert.equal( like({ count: 1 }), "You liked this" );

	assert.equal( like({
		count: 2,
		someone: "Beethoven"
	}), "You and Beethoven liked this" );

	assert.equal( like({ count: 3 }), "You and 2 others liked this" );

	// Selectordinal
	assert.messageFormatter( "en", "ordinal", {
		cat: 1,
	}, "1st category" );

	assert.messageFormatter( "en", "ordinal", {
		cat: 2,
	}, "2nd category" );

	assert.messageFormatter( "en", "ordinal", {
		cat: 3,
	}, "3rd category" );

	assert.messageFormatter( "en", "ordinal", {
		cat: 4,
	}, "4th category" );
});

QUnit.test( "should support BiDi structured text", function( assert ) {
	assert.equal(
		Globalize( "he" ).messageFormatter( "helloArray", {
			setBiDiSupport: true
		})( "Beethoven", "Mozart" ),
		"Hello, \u200FBeethoven\u200F & \u200FMozart\u200F"
	);
});

// Reference #473
QUnit.test( "should NOT merge array data", function( assert ) {
	// Re-loading a message that uses array syntax.
	Globalize.loadMessages({
		en: {
			task: [
				"You have {0, plural,",
				"    one {one task}",
				"  other {# tasks}",
				"} remaining"
			]
		}
	});
	assert.messageFormatter( "en", "task", 123, "You have 123 tasks remaining" );
});

QUnit.test( "should allow for runtime compilation", function( assert ) {
	util.assertRuntimeBind(
		assert,
		Globalize( "en" ).messageFormatter( "amen" ),
		"b141291319",
		"Globalize(\"en\").messageFormatter(\"amen\",{})",
		function( runtimeArgs ) {
			assert.equal(
				runtimeArgs[ 0 ].toString(),
				"(function(  ) {\n  return function(d) { return \"Amen\"; }\n})"
			);
		}
	);

	util.assertRuntimeBind(
		assert,
		Globalize( "en" ).messageFormatter( "like" ),
		"b452335545",
		"Globalize(\"en\").messageFormatter(\"like\",{})",
		function( runtimeArgs ) {
			assert.equal(
				runtimeArgs[ 0 ].toString(),
				"(function( en ) {\nvar number = messageFormat.number;\nvar plural = messageFormat.plural;\n  return function(d) { return plural(d.count, 1, en, { \"0\": \"Be the first to like this\", \"1\": \"You liked this\", one: \"You and \" + d.someone + \" liked this\", other: \"You and \" + number(d.count, \"count\", 1) + \" others liked this\" }); }\n})"
			);
		}
	);
});

});
