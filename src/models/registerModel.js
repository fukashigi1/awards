import {validateEmail, validatePassword} from '../utils/fnUtilsBE.js'
import {connection} from '../server.js'
import bcrypt from 'bcrypt'

export class registerModel {
    
    static register = async ({userData}) => {
        let {usernameInput, emailInput, emailConfirmInput, passwordInput, passwordConfirmInput} = userData
        let errors = []
        if (usernameInput === undefined || emailInput === undefined || emailConfirmInput === undefined || passwordInput === undefined || passwordConfirmInput === undefined) {
            return {status: 400, msg: 'A value has not been delivered. Please check your input.'}
        } else {
            if (usernameInput.trim() === '') {
                errors.push({msg: 'Username field cannot be empty.', element: 'usernameInput'})
            } else if (validateEmail(usernameInput.trim())) {
                errors.push({msg: 'Username cannot be an email.', element: 'usernameInput'})
            } else {
                try {
                    let [usernameExist] = await connection.query('SELECT username FROM users WHERE username = ?', [usernameInput.trim()])
                    if (usernameExist.length > 0) {
                        errors.push({msg: 'The username entered is already in use.', element: 'usernameInput'})
                    }
                } catch (e) {
                    return {status: 500, msg: 'An internal error has ocurred.'}
                }
            }
            if (emailInput.trim() === '') {
                errors.push({msg: 'Email field cannot be empty.', element: 'emailInput'})
            } else if (!validateEmail(emailInput.trim())) {
                errors.push({msg: 'The email entered is not valid.', element: 'emailInput'})
            }
            if (emailConfirmInput.trim() === '') {
                errors.push({msg: 'Email confirmation field cannot be empty.', element: 'emailConfirmInput'})
            } else if (emailInput !== emailConfirmInput) {
                errors.push({msg: 'The emails entered are not the same.', element: 'emailConfirmInput'})
            } else {
                try {
                    let [emailExist] = await connection.query('SELECT email FROM users WHERE email = ?', [emailConfirmInput.trim()])
                    if (emailExist.length > 0) {
                        errors.push({msg: 'The email entered is already in use.', element: 'emailInput'})
                    }
                } catch (e) {
                    return {status: 500, msg: 'An internal error has ocurred.'}
                }
            }
            if (passwordInput === '') {
                errors.push({msg: 'Password field cannot be empty.', element: 'passwordInput'})
            } else if (!validatePassword(passwordInput)) {
                errors.push({msg: 'Password field must have 8 characters.', element: 'passwordInput'})
            }
            if (passwordConfirmInput === '') {
                errors.push({msg: 'Password confirm input cannot be empty.', element: 'passwordConfirmInput'})
            } else if (passwordInput !== passwordConfirmInput) {
                errors.push({msg: 'The passwords entered are not the same.', element: 'passwordConfirmInput'})
            }
        }

        if (errors.length > 0) {
            return {status: 400, msg: errors}
        } else {
            try {
                const hashedPassword = await bcrypt.hash(passwordConfirmInput, 10)
                let [registerResult] = await connection.query('INSERT INTO users (username, email, pass) VALUES (?, ?, ?)', [usernameInput.trim(), emailConfirmInput.trim().toLowerCase(), hashedPassword])
                if (registerResult.affectedRows > 0) {
                    return {status: 201, msg: 'User registered succesfully.'}
                } else {
                    return {status: 500, msg: 'An unexpected internal error has ocurred.'}
                }
                
            } catch (e) {
                return {status: 500, msg: 'An unexpected internal error has ocurred.'}
            }
        }

    }
}