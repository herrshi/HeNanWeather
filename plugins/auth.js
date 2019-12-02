export default ({ app }) => {
  app.router.beforeEach((to, from, next) => {
    const mapOnly = to.query.mapOnly
    if (mapOnly) {
      app.store.commit('hideNav')
    } else {
      app.store.commit('showNav')
    }
    next()
  })
}
