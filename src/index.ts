import { IPluginContext } from '@tarojs/service'

import Server from './Server'
import { createMockMiddleware } from './utils'

export default (ctx: IPluginContext, pluginOpts) => {
  ctx.addPluginOptsSchema(joi => {
    return joi.object().keys({
      mocks: joi.object().pattern(
        joi.string(), joi.object()
      ),
      port: joi.number(),
      host: joi.string()
    })
  })
  ctx.onBuildFinish(async () => {
    const { appPath } = ctx.paths
    const {
      mocks,
      port,
      host
    } = pluginOpts
    const { chokidar } = ctx.helper
    const server = new Server({
      port,
      host,
      middlewares: [
        createMockMiddleware({
          appPath,
          mocks,
          chokidar
        })
      ]
    })
    await server.start()
  })
}
