import * as ko from 'knockout'
import 'knockout-punches'
import {
  Route,
  Router,
  createProgressBarMiddleware,
  childrenRoutePlugin,
  componentRoutePlugin,
  componentInitializerRoutePlugin,
  componentsRoutePlugin,
  createTitleRoutePlugin
} from '@profiscience/knockout-contrib'

async function main() {
  const { punches } = ko as any

  ko.options.deferUpdates = true

  punches.enableAll()

  Router.setConfig({
    preserveQueryStringOnNavigation: true
  })

  Router.use(
    createProgressBarMiddleware({
      color: 'green'
    })
  )

  Route.usePlugin(
    componentRoutePlugin,
    componentsRoutePlugin,
    componentInitializerRoutePlugin,
    createTitleRoutePlugin((ts) => `growhaus | ${ts.join(' > ')}`),
    childrenRoutePlugin
  )

  const { routes } = await import(/* wepbackMode: "eager" */ 'src/routes')

  Router.useRoutes(routes)

  // @ts-ignore
  if (DEBUG) await import(/* webpackMode: "eager" */ 'src/debug')

  ko.applyBindings(document.body)
}

main()
