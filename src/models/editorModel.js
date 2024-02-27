import {connection} from '../server.js'

export class editorModel {
    static view = async ({awardData}) => {
        const {award_id, award_name, session_id} = awardData
        
        try {
            const [owner_id] = await connection.query('SELECT BIN_TO_UUID(user_id) as user_id FROM sessions WHERE session_id = UUID_TO_BIN(?)', session_id)
            
            if (owner_id.length > 0){
                
                const [selectAward] = await connection.query('SELECT id FROM awards WHERE owner = UUID_TO_BIN(?) AND id = ? AND award_name = ?', [owner_id[0].user_id, award_id, award_name])
                
                if (selectAward.length > 0) {
                    return {
                        status: 200,
                    }
                } else {
                    return {
                        status: 400,
                        content: [{msg: 'The resource does not exist.'}]
                    }
                }
            } else {
                return {
                    status: 401,
                    content: [{msg: 'Session id does not match with user id.'}]
                }
            }
        } catch (e) {
            return {
                status: 500,
                content: [{msg: 'An unexpected internal server error has occurred.'}]
            }
        }
        
    }

    static obtainQuestions = async ({awardData}) => {
        const {award_id, award_name, session_id} = awardData
        
        try {
            const [owner_id] = await connection.query('SELECT BIN_TO_UUID(user_id) as user_id FROM sessions WHERE session_id = UUID_TO_BIN(?)', session_id)

            if (owner_id.length > 0){
                
                try {
                    const [selectAward] = await connection.query('SELECT id FROM awards WHERE owner = UUID_TO_BIN(?) AND id = ? AND award_name = ?', [owner_id[0].user_id, award_id, award_name])
                    if (selectAward.length > 0) {
                        const [selectQuestions] = await connection.query('SELECT BIN_TO_UUID(id) as id, id_award, questions, question_type FROM question WHERE id_award = ? ORDER BY  order_id', [selectAward[0].id])
                        return {
                            status: 200,
                            content: selectQuestions
                        }
                    } else {
                        return {
                            status: 400,
                            content: [{msg: 'The resource does not exist.'}]
                        }
                    }

                } catch (e) {
                    return {
                        status: 500,
                        content: [{msg: 'An unexpected internal error has ocurred while trying to obtain resources.'}]
                    }
                }
            } else {
                return {
                    status: 401,
                    content: [{msg: 'Session id does not match with user id.'}]
                }
            }
        } catch (e) {
            return {
                status: 500,
                content: [{msg: 'An unexpected internal server error has occurred.'}]
            }
        }
    }

    static saveQuestions = async ({awardData}) => {
        const {award_id, award_name, questions, session_id} = awardData
        
        try {
            const [owner_id] = await connection.query('SELECT BIN_TO_UUID(user_id) as user_id FROM sessions WHERE session_id = UUID_TO_BIN(?)', session_id)

            if (owner_id.length > 0){

                const [selectAward] = await connection.query('SELECT id FROM awards WHERE owner = UUID_TO_BIN(?) AND id = ? AND award_name = ?', [owner_id[0].user_id, award_id, award_name])
                if (selectAward.length > 0) {
                    
                    const [selectQuestions] = await connection.query('SELECT BIN_TO_UUID(id) as id, id_award, question, question_type FROM questions WHERE id_award = ? ORDER BY order_id' , [award_id])
                     
                    // comprobar si selected question tiene resultados, si es que tiene hacer
                    // comprobar las id de cada una de las preguntas y ver si el uuid ya existe, en caso de que exista debe remplazxar toda la info, en caso de que no exista agregarlo.

                    return {
                        status: 200,
                        content: selectQuestions
                    }
                } else {
                    return {
                        status: 400,
                        content: [{msg: 'The resource does not exist.'}]
                    }
                }
                
            } else {
                return {
                    status: 401,
                    content: [{msg: 'Session id does not match with user id.'}]
                }
            }
        } catch (e) {
            return {
                status: 500,
                content: [{msg: 'An unexpected internal server error has occurred while trying to save resources.'}]
            }
        }
    }
}