import {Getter, Mutation, Action} from '@/store/modules/user/types'
import axios from 'axios'
import slugify from 'slugify'

const USERSURL = "http://127.0.0.1:8000/users/"
const AUTHENTICATIONURL = "http://127.0.0.1:8000/authentication/"



export const getters: Getter = {
  isAuthenticated: state => !!state.user,
// =====================================================
  getUser: state => state.user,
// =====================================================
  getAllUsers: state => state.userList,
// =====================================================
  getErrorMessage: state => state.errorMessage,
// =====================================================
  getRetrievedUser: state => state.retrievedUser,
// =====================================================
}





export const mutations: Mutation = {
	setUser(state, user) {
    state.user = user
  },
// =====================================================
  setAllUsers(state, users) {
    state.userList = users
  },
// =====================================================
  logout(state) {
    state.user = null
  },
// =====================================================
  setErrorMessage(state, errorMessage) {
    state.errorMessage = errorMessage
  },
// =====================================================
  setRetrievedUser(state, user) {
    state.retrievedUser = user
  },
}






export const actions: Action = {
	async RegisterNewUser({commit}, User) {
    const userForm = new FormData()
    userForm.append('email', User.email)
    userForm.append('nickname', User.nickname)
    if (User.profilePicture) {
      userForm.append('profilePicture', User.profilePicture, User.profilePicture.name)
      console.log(User.profilePicture)
    }
    userForm.append('gender', User.gender)
    userForm.append('age', User.age)
    userForm.append('ethnicity', User.ethnicity)
    userForm.append('location', User.location)
    userForm.append('fromFirebase', User.fromFirebase)
    userForm.append('password', User.password)
    try {
      await axios.post(USERSURL, userForm)
      console.log('A new user registered')
      commit('setErrorMessage', "")
    } catch (error) {
      console.log(error.message + " post error")
      commit('setErrorMessage', error.message)
    }
  },
// =====================================================
  async UpdateUser({commit, state}, userForm) {
    const newForm = new FormData()
    newForm.append('email', userForm.email)
    newForm.append('nickname', userForm.nickname)
    newForm.append('slug', userForm.slug)
    newForm.append('gender', userForm.gender)
    newForm.append('age', userForm.age)
    newForm.append('ethnicity', userForm.ethnicity)
    newForm.append('location', userForm.location)
    newForm.append('bio', userForm.bio)
    let password = userForm.password
    if (userForm.password == null) {
      if (state.user) {
        password = state.user.password
      }
    }
    newForm.append('password', password)
    try {
      const response = await axios.put(USERSURL+userForm.slug+"/", newForm)
      commit('setErrorMessage', "")
      await commit('setUser', response.data)
    } catch (error) {
      commit('setErrorMessage', error)
    }
  },
// =====================================================
  async RetrieveUser({commit}, slug) {
    try {
      const response = await axios.get(USERSURL+slug)
      commit('setErrorMessage', "")
      commit('setRetrievedUser', response.data)
    } catch (error) {
      commit('setErrorMessage', error)
      console.log(error + " ERROR RETRIEVING USER")
    }
  },
// =====================================================
  async GetAllUsers({commit}) {
    try {
      const response = await axios.get(USERSURL)
      commit('setErrorMessage', "")
      commit('setAllUsers', response.data)
    } catch (error) {
      console.log(error + " ERROR GETTING ALL USERS")
      commit('setErrorMessage', error)
    }
  },
// =====================================================
  async Login({dispatch, commit}, User) {
    const userForm = new FormData()
    userForm.append('email', User.email)
    userForm.append('password', User.password)
    try {
      await axios.post(AUTHENTICATIONURL, userForm)
      await dispatch('GetUser', userForm)
    } catch(error) {
      console.log(error + " ERROR LOGGING IN")
      commit('setErrorMessage', error)
    }
  },
// =====================================================
  async GetUser({commit}, userForm) {
    let slug = slugify(userForm.get('email').split('@')[0])
    slug = slug.replaceAll('.', '')
    try {
      const response = await axios.get(USERSURL+slug)
      commit('setErrorMessage', "")
      await commit('setUser', response.data)
    } catch (error) {
      console.log(error + " GET USER ERROR")
      commit('setErrorMessage', error)
    }
  },
// =====================================================
    async GetUserImage({commit}, imageURL) {
      try {
        const response = await axios.get(imageURL)
        
        commit("setImage", response.data)
      } catch(error) {
        console.log(error + " ERROR FETCHING IMAGE")
        
      }
    },
// =====================================================
    async ChangeUserImage({commit, state}, imageForm) {
      const newImage = new FormData()
      if (state.user) {
        newImage.append('email', state.user.email)
        newImage.append('slug', state.user.slug)
        newImage.append('password', state.user.password)
      }
      newImage.append('profilePicture', imageForm.profilePicture, imageForm.profilePicture.name)
      
      try {
        await axios.put(USERSURL+newImage.get('slug')+'/', newImage)
        commit('setErrorMessage', "")
        const response = await axios.get(USERSURL+newImage.get('slug')+'/')
        commit('setUser', response.data)
      } catch (error) {
        console.log(error + " ERROR CHANGING IMAGE")
        commit('setErrorMessage', error)
      }
    },
// =====================================================
  Logout({commit}) {
    commit("logout")
  },
}
