import * as ko from 'knockout'

import { wrapBindings } from 'src/bindings/errorHandler'

wrapBindings()

window.addEventListener('unhandledRejection', (...args: any[]) =>
  console.error('Unhandled rejection:', ...args)
)

declare global {
  interface KnockoutObservableFunctions<T> {
    toString(): string
  }
}

enum KnockoutObservableType {
  Observable = 'Observable',
  ObservableArray = 'ObservableArray',
  Computed = 'Computed'
}

ko.observable.fn.toString = function(this: ko.Observable<any>): string {
  return toString(this, KnockoutObservableType.Observable)
}

ko.observableArray.fn.toString = function(
  this: ko.ObservableArray<any>
): string {
  return toString(this, KnockoutObservableType.ObservableArray)
}

ko.computed.fn.toString = function(this: ko.Computed<any>): string {
  return toString(this, KnockoutObservableType.Computed)
}

function toString(
  obs: ko.MaybeComputed<any>,
  type: KnockoutObservableType
): string {
  return `${type}(${ko.toJSON(obs())})`
}
