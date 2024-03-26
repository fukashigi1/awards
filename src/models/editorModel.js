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
                        const [selectQuestions] = await connection.query('SELECT BIN_TO_UUID(id) as id, question, question_type FROM questions WHERE id_award = ? ORDER BY order_id', [selectAward[0].id])

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
        
        if (questions.length == 0) {
            return {
                status: 200,
                content: [{msg: 'No changes have been made.'}]
            }
        }

        try {
            const [owner_id] = await connection.query('SELECT BIN_TO_UUID(user_id) as user_id FROM sessions WHERE session_id = UUID_TO_BIN(?)', session_id)

            if (owner_id.length > 0){

                const [selectAward] = await connection.query('SELECT id FROM awards WHERE owner = UUID_TO_BIN(?) AND id = ? AND award_name = ?', [owner_id[0].user_id, award_id, award_name])
                if (selectAward.length > 0) {
                    
                    const [selectQuestions] = await connection.query('SELECT BIN_TO_UUID(id) as id, question, question_type FROM questions WHERE id_award = ? ORDER BY order_id' , [award_id])

                    if (selectQuestions.length > 0) { // En caso de que haya questions
                        let questionInputId, questionDbId

                        for (let i in questions) {
                            let changed = false
                            questionInputId = questions[i]
                            if (questionInputId.question === undefined || questionInputId.question_type === undefined || questionInputId.order_id === undefined){
                                return {
                                    status: 400,
                                    content: [{msg: 'Invalid data. Please verify your input.'}]
                                }
                            }

                            for (let x in selectQuestions) {
                                questionDbId = selectQuestions[x]
                                console.log(questionInputId.id, questionDbId.id)
                                if (questionInputId.id === questionDbId.id) {
                                    const [replaceQuestion] = await connection.query('UPDATE questions SET question = ?, question_type = ?, order_id = ? WHERE id = UUID_TO_BIN(?)', [questionInputId.question, questionInputId.question_type, questionInputId.order_id, questionInputId.id])
                                    console.log("update")   
                                    changed = true
                                    break
                                } 
                            }

                            if (!changed) {
                                console.log("aca", changed)
                                const [addQuestion] = await connection.query('INSERT INTO questions (id_award, question, question_type, order_id) VALUES (?, ?, ?, ?)', [award_id, questionInputId.question, questionInputId.question_type, questionInputId.order_id])
                            }
                        }

                    } else {  // En caso de que no hayan questions
                        let question

                        for (let i in questions) {
                            question = questions[i]
                            const [addQuestion] = await connection.query('INSERT INTO questions (id_award, question, question_type, order_id) VALUES (?, ?, ?, ?)', [award_id, question.question, question.question_type, question.order_id])
                        }

                    }
                
                    return {
                        status: 200,
                        content: [{msg: 'All questions have been saved.'}]
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