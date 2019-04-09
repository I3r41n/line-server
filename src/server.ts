import { appBuilder } from './app'

if(process.env.FILE === '/data/') {
  console.error('No file was passed as an argument')
  throw new Error('No file was passed as an argument')
}

const server = appBuilder(process.env.FILE!).then(app => {
  app.listen(app.get('port'), () => {
      console.log(
        `App is running on http://localhost:${app.get('port')} in ${app.get('env')} mode`,
      )
    })
  }).catch()

export default server