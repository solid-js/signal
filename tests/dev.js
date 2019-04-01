"use strict";
/**
 * Work in progress dev file.
 * This file is meant to be used when working on your lib.
 * Useful when trying to get something working before it's testable.
 */
exports.__esModule = true;
var index_1 = require("../dist/index");
//const onClicked = Signal.fromEvent(document, 'click');
//const eventSignal = new EventSignal<MouseEvent>( document, 'click' );
var objectStateSignal = new index_1.StateSignal({ on: false });
objectStateSignal.add(function (state) {
    // FIXME : state.otherProp devrait lever une erreur TS
    console.log('State signal', state, state.otherProp);
});
objectStateSignal.dispatch({ on: true });
objectStateSignal.dispatch({ on: true });
objectStateSignal.dispatch({ on: false });
objectStateSignal.dispatch({ on: false });
objectStateSignal.dispatch({ on: true });
objectStateSignal.dispose();
var simpleStateSignal = new index_1.StateSignal(false);
simpleStateSignal.add(function (state) {
    console.log('Simple state signal', state);
});
simpleStateSignal.dispatch(true);
simpleStateSignal.dispatch(true);
simpleStateSignal.dispatch(false);
simpleStateSignal.dispatch(false);
simpleStateSignal.dispatch(true);
simpleStateSignal.dispose();
