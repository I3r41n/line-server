import { appBuilder } from './app'

console.log(process.env.FILE)
const server = appBuilder(process.env.FILE!).then(app => {
  app.listen(app.get('port'), () => {
      console.log(
        `App is running on http://localhost:${app.get('port')} in ${app.get('env')} mode`,
      )
    })
  })

export default server