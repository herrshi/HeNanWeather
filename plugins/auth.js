export default ({ app }) => {
  app.router.beforeEach((to, from, next) => {
    const { mapOnly, roleId } = to.query
    if (mapOnly) {
      app.store.commit('hideNav')
    } else {
      app.store.commit('showNav')
    }

    const sideNavbarItems = app.store.state.user.sideNavbarItems
    if (!sideNavbarItems && roleId) {
      app.store.dispatch('user/getMenuByRole', { roleId })
    }
    next()
  })
}
