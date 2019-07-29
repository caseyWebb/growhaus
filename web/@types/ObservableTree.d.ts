type ObservableTree<T> = T extends any[]
  ? ko.ObservableArray<T[number]>
  : T extends Date
  ? ko.Observable<Date>
  : T extends RegExp
  ? ko.Observable<RegExp>
  : T extends ko.Observable
  ? T
  : T extends ko.ObservableArray
  ? T
  : T extends ko.Computed
  ? T
  : T extends (...args: any[]) => any
  ? T
  : T extends { [k: string]: any }
  ? { readonly [P in keyof T]: ObservableTree<T[P]> }
  : ko.Observable<T>

type MaybeObservableTree<T> = T extends any[]
  ? ko.MaybeObservableArray<ObservableTree<T[number]>>
  : T extends Date
  ? ko.MaybeObservable<Date>
  : T extends RegExp
  ? ko.MaybeObservable<RegExp>
  : T extends ko.Observable
  ? T
  : T extends ko.ObservableArray
  ? T
  : T extends ko.Computed
  ? T
  : T extends (...args: any[]) => any
  ? T
  : T extends { [k: string]: any }
  ? { readonly [P in keyof T]: MaybeObservableTree<T[P]> }
  : ko.MaybeObservable<T>
