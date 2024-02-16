import {validateEmail} from '../utils/fnUtilsBE.js'
import {connection} from '../server.js'
import bcrypt from 'bcrypt'

export class loginModel {
    static login = async ({userData}) => {
        const {usernameEmailInput, passwordInput} = userData;
        const trimmedInput = usernameEmailInput.trim();
    
        if (!trimmedInput || !passwordInput) {
            return {
                status: 400,
                content: [{msg: 'A value has not been delivered. Please check your input.'}]
            };
        }
    
        const isEmail = validateEmail(trimmedInput);
        const query = isEmail ? 'SELECT email, pass FROM users WHERE email = ?' : 'SELECT username, pass FROM users WHERE username = ?';
    
        try {
            const [selectResult] = await connection.query(query, [trimmedInput]);
    
            if (selectResult.length === 0) {
                return {
                    status: 400,
                    content: [{msg: `The ${isEmail ? 'email' : 'username'} you entered is not connected to an account.`, element: 'usernameEmailInput'}]
                };
            }
    
            const isPasswordCorrect = await bcrypt.compare(passwordInput, selectResult[0].pass);
    
            if (isPasswordCorrect) {
                return {
                    status: 200,
                    content: [{msg: "User logged in successfully."}]
                };
            } else {
                return {
                    status: 400,
                    content: [{msg: 'The password entered is not correct.', element: 'passwordInput'}]
                };
            }
        } catch (error) {
            return {
                status: 500,
                content: [{msg: 'An internal server error has occurred.'}]
            };
        }
    };
}