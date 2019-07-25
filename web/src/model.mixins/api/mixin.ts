import {
  DataModelConstructorBuilder,
  nonenumerable
} from '@profiscience/knockout-contrib'
import { ApiHelper } from 'src/utils/api-helper'

// tslint:disable-next-line:variable-name
export const APIMixin = (controller: string) => {
  const api = new ApiHelper(controller)

  return <P, T extends new (...args: any[]) => DataModelConstructorBuilder<P>>(
    ctor: T
  ) =>
    class extends ctor {
      protected static api = api
      protected api = api

      constructor(...args: any[]) {
        super(...args)
        nonenumerable(this, 'api')
      }

      protected async fetch(initData?: any) {
        return initData || (await api.get({ query: this.params }))
      }

      public async save() {
        const res = await api.post({ query: this.params, data: this.toJS() })
        await super.save()
        return res
      }

      public async delete(): Promise<any> {
        const res = await api.delete({ query: this.params })
        await super.delete()
        return res
      }
    }
}
