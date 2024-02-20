import {connection} from '../server.js'

export function validateEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
}


export async function validateSession(cookie) {
    
    function obtainValueOfKey(list, searchedKey) {
        for (let i = 0; i < list.length; i++) {
            let element = list[i];
            
            if (typeof element === 'string' && element.includes('=')) {
                
                let [key, value] = element.split('=');
                
                if (key === searchedKey) {
                    return value;
                }
            }
        }
        
        return null;
    }
    
    if (cookie !== undefined) {
        const cookieArray = cookie.replace('; ', '=').split('=')
        const indexCookie = cookieArray.indexOf('session')
        const cookieSessionId = cookieArray[indexCookie + 1]
        if (cookieSessionId) {
            try {
                const [selectSessionId] = await connection.query('SELECT BIN_TO_UUID(session_id) as session_id FROM sessions WHERE session_id = UUID_TO_BIN(?)', [cookieSessionId])
                if (selectSessionId.length > 0) {
                    return true
                } else {
                    return false
                }
    
            } catch (e) {
                return false
            }     
    
        }else {
            return false
        }
    } else {
        return false
    }
}