import { AgentData, WebApiEvents } from '@caseywebb/growhaus'

import { AbstractSocketModel } from './_abstract'

class AgentsModel extends AbstractSocketModel<{
  agents: { [k: string]: AgentData }
}> {
  constructor() {
    super(WebApiEvents.AgentData)
  }
}

export const agents = new AgentsModel()
