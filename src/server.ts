import { appBuilder } from './app'

const server = appBuilder('').then(app => {
  app.listen(app.get('port'), () => {
      console.log(
        `App is running on http://localhost:${app.get('port')} in ${app.get('env')} mode`,
      )
    })
  })

export default server