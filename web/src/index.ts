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

function getBasePath() {
  const el = document.createElement('a')
  el.href = WEB_UI_URL
  return el.pathname
}

async function main() {
  const { punches } = ko as any

  ko.options.deferUpdates = true

  punches.enableAll()

  Router.setConfig({
    base: getBasePath(),
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
