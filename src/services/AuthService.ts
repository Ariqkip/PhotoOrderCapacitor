import newAPI from "../core/newAPI";

// TODO add typings
class AuthService {
    getPhotographer(token: string) {
        return newAPI.get('photographer', {headers: {
            'Authorization': token
            }})
            .then(res => {
                if (res.status === 200) {
                    return res.data
                } else return Promise.reject('wrong_token')
            })
    }
}

const authService = new AuthService()

export default authService
