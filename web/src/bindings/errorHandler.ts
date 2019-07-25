import * as ko from 'knockout'
import { isFunction } from 'lodash'

const WRAPPED = Symbol()

export function wrapBindings() {
  Object.entries(ko.bindingHandlers).forEach(([key, binding]) => {
    if ((binding as any)[WRAPPED]) return
    else (binding as any)[WRAPPED] = true

    const { init, update } = { ...binding }

    // wrap init with an error handler
    if (init) {
      binding.init = (
        element,
        valueAccessor,
        allBindings,
        viewModel,
        bindingContext
      ) => {
        try {
          return init(
            element,
            valueAccessor,
            allBindings,
            viewModel,
            bindingContext
          )
        } catch (error) {
          console.warn(
            `Unable to process binding '${key}' for element:`,
            element,
            'knockout context:',
            getInfo(element, true),
            error
          )
          throw error
        }
      }
    }

    if (update) {
      binding.update = (
        element,
        valueAccessor,
        allBindings,
        viewModel,
        bindingContext
      ) => {
        try {
          return update(
            element,
            valueAccessor,
            allBindings,
            viewModel,
            bindingContext
          )
        } catch (error) {
          console.warn(
            `Unable to process binding '${key}' for element:\n`,
            element,
            '\n',
            'knockout context:\n',
            getInfo(element, true),
            '\n',
            error
          )
          throw error
        }
      }
    }
  })
}

// inspired by chrome extension
// https://github.com/timstuyckens/chromeextensions-knockoutjs/blob/master/pages/js/devtools.js
const getInfo = (el: HTMLElement, shouldSerialize: boolean) => {
  let i = 0
  const copy: any = { __proto__: null }
  const copy2: any = { __proto__: null }
  const context: any = el ? ko.contextFor(el) : {}

  try {
    const props = Object.getOwnPropertyNames(context)
    for (i = 0; i < props.length; ++i) {
      // you probably want to see the value of the index instead of the ko.observable function
      if (props[i] === '$index') {
        copy['$index()'] = ko.utils.unwrapObservable(context[props[i]])
      } else if (props[i] === '$root') {
        if (context[props[i]] !== window) {
          try {
            if (shouldSerialize) {
              copy.$root_toJS = ko.toJS(context[props[i]])
            } else {
              copy.$root = context[props[i]]
            }
          } catch (toJsErr) {
            copy.$root_toJS = 'Error: ko.toJS(' + props[i] + ')'
            copy.$root_toJS_exc = toJsErr
          }
        } else {
          copy.$root = '(Global window object)'
        }
      } else {
        if (props[i] === '$cell') {
          // repeat binding support
          copy[props[i]] = shouldSerialize
            ? ko.toJS(context[props[i]])
            : ko.utils.unwrapObservable(context[props[i]])
        } else {
          copy[props[i]] = ko.utils.unwrapObservable(context[props[i]])
        }
      }
    }
  } catch (err) {
    // when you don't select a dom node but plain text (rare)
    return {
      info: 'Please select a DOM node with ko data.',
      ExtensionError: err
    }
  }

  try {
    const dataFor = el ? ko.dataFor(el) : {}
    const data = shouldSerialize
      ? ko.toJS(dataFor)
      : ko.utils.unwrapObservable(dataFor)

    if (typeof data === 'string') {
      // don't do getOwnPropertyNames if it's not an object
      copy.vm_string = data
    } else {
      try {
        const props2 = Object.getOwnPropertyNames(data)
        for (i = 0; i < props2.length; ++i) {
          // create a empty object that contains the whole vm in a expression. contains even the functions.
          copy2[props2[i]] = ko.utils.unwrapObservable(data[props2[i]])
          // show the basic properties of the vm directly, without the need to collapse anything
          if (shouldSerialize) {
            // if you don't serialize, the isFunction check is useless b/c observables are functions
            if (!isFunction(data[props2[i]])) {
              // chrome sorts alphabetically, make sure the properties come first
              copy[' ' + props2[i]] = data[props2[i]]
            }
          } else {
            copy[' ' + props2[i]] = ko.utils.unwrapObservable(data[props2[i]])
          }
        }
        // set the whole vm in a expression (collapsable). contains even the functions.
        copy.vm_toJS = copy2
      } catch (err) {
        // don't know the type but try to display the data
        copy.vm_no_object = data
      }
    }
  } catch (error) {
    copy.error = error
  }
  return copy
}
