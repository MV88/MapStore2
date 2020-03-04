
import Rx from 'rxjs';
import { isFunction } from 'lodash';
import { ActionsObservable, combineEpics } from 'redux-observable';
/**
 * The action emitted by the addTimeoutEpic
 * @type {string}
 */
export const TEST_TIMEOUT = "EPICTEST:TIMEOUT";

/**
 * Utility to test an epic
 * @param  {function}   epic       the epic to test
 * @param  {number}   count      the number of actions to wait (note, the stream)
 * @param  {object|object[]}   action     the action(s) to trigger
 * @param  {function} callback   The check function, called after `count` actions received
 * @param  {Object|function}   [state={}] the state or a function that return it
 */
export const testEpic = (epic, count, action, callback, state = {}, done) => {
    const actions = new Rx.Subject();
    const actions$ = new ActionsObservable(actions);
    const store = { getState: () => isFunction(state) ? state() : state, dispatch: () => {}};
    epic(actions$, store)
        .take(count)
        .toArray()
        .subscribe(done ? (x) => {
            try {
                callback(x);
                done();
            } catch (e) {
                done(e);
            }
        } : callback);
    if (action.length) {
        action.map(act => actions.next(act));
    } else {
        actions.next(action);
    }
};

/**
 * Combine the epic with another than emits TEST_TIMEOUT action.
 * @param {function} epic         The epic to combine
 * @param {Number} [timeout=1000] milliseconds to wait after emit the TEST_TIMEOUT action.
 */
export const addTimeoutEpic = (epic, timeout = 1000) => combineEpics(epic, () => Rx.Observable.timer(timeout).map(() => ({type: TEST_TIMEOUT, timeout})));


export default {
    testEpic,
    TEST_TIMEOUT,
    addTimeoutEpic
};

