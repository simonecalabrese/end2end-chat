export const getCurrentUser = async () => {
  let user = localStorage.getItem('user') != null ? localStorage.getItem('user') : {}
  if(Object.keys(user).length === 0 && location.href.indexOf('login') === -1) {
    location.href = '/login'
  }
  return user;
}