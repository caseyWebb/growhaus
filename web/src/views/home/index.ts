import { Route } from '@profiscience/knockout-contrib'

export default new Route('/', {
  component: () => ({
    template: import('./template.html'),
    viewModel: import('./viewModel')
  })
})
