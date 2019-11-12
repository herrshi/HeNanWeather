export default {
  userLogin(userId, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'success' })
      }, 500)
    })
  }
}
