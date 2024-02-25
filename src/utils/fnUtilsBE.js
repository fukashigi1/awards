import {connection} from '../server.js'

export function validateEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
}


export async function validateSession(cookie) {
    
    if (cookie !== undefined) {
        const cookieSessionId = obtainSessionId(cookie)
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

export function obtainSessionId(cookie) {
    if (cookie === undefined)
        return undefined
    const cookieArray = cookie.replace('; ', '=').split('=')
    const indexCookie = cookieArray.indexOf('session')
    const cookieSessionId = cookieArray[indexCookie + 1]
    return cookieSessionId
}