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
                        const [selectQuestions] = await connection.query('SELECT BIN_TO_UUID(id) as id, question, question_type, url, mandatory, question_choices FROM questions WHERE id_award = ? ORDER BY order_id', [selectAward[0].id])

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
        const {award_id, award_name, questions, deleted_questions = 0, session_id} = awardData
        
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
                    
                    const [selectQuestions] = await connection.query('SELECT BIN_TO_UUID(id) as id, question, question_type, url, mandatory, question_choices FROM questions WHERE id_award = ? ORDER BY order_id' , [award_id])

                    if (deleted_questions.length > 0) { // Check if there are questions to be removed
                        for (let i in deleted_questions) {
                            await connection.query('DELETE FROM questions WHERE id = UUID_TO_BIN(?) AND id_award = ?', [deleted_questions[i].id, award_id])
                        }
                        if (questions.length == 0 ) {
                            return {
                                status: 200,
                                content: [{msg: 'The questions were deleted succesfully.'}]
                            }
                        }
                    }

                    if (selectQuestions.length > 0) { // En caso de que haya questions
                        let questionInputId, questionDbId
                        for (let i in questions) {
                            let changed = false
                            questionInputId = questions[i]
                            if (questionInputId.url !== undefined) {
                                if (!validateUrl(questionInputId.url)){
                                    return {
                                        status: 400,
                                        content: [{msg: 'The url provided is not valid.'}]
                                    }
                                }
    
                            }
                            
                            function validateUrl(url){
                                let ytRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu\.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/
                                let imageRegex = /^(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ;,./?%&=]*)?\.(jpg|jpeg|png|gif|svg)$/

                                if (ytRegex.test(url)) {
                                    return true;
                                } else if (imageRegex.test(url)) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }


                            if (questionInputId.question === undefined || questionInputId.question_type === undefined || questionInputId.order_id === undefined){
                                return {
                                    status: 400,
                                    content: [{msg: 'Invalid data. Please verify your input.'}]
                                }
                            }
                            if (questionInputId.mandatory === undefined || questionInputId.mandatory > 1) {
                                questionInputId.mandatory = 1
                            } else if (questionInputId.mandatory < 0) {
                                questionInputId.mandatory = 0
                            }
                            

                            for (let x in selectQuestions) {
                                questionDbId = selectQuestions[x]
                                if (questionInputId.id === questionDbId.id) {
                                    await connection.query('UPDATE questions SET question = ?, question_type = ?, order_id = ?, url = ?, mandatory = ?, question_choices = ? WHERE id = UUID_TO_BIN(?)', [questionInputId.question, questionInputId.question_type, questionInputId.order_id, questionInputId.url, questionInputId.mandatory, questionInputId.question_choices, questionInputId.id])
                                    changed = true
                                    break
                                } 
                            }

                            if (!changed) {
                                console.log ("ohola");
                                await connection.query('INSERT INTO questions (id_award, question, question_type, order_id, url, mandatory, question_choices) VALUES (?, ?, ?, ?, ?, ?, ?)', [award_id, questionInputId.question, questionInputId.question_type, questionInputId.order_id, questionInputId.url, questionInputId.mandatory, questionInputId.question_choices])
                            }
                        }

                    } else {  // En caso de que no hayan questions
                        let question

                        for (let i in questions) {
                            question = questions[i]
                            await connection.query('INSERT INTO questions (id_award, question, question_type, order_id, url, mandatory, question_choices) VALUES (?, ?, ?, ?, ?, ?)', [award_id, question.question, question.question_type, question.order_id, question.url, question.mandatory, question.question_choices])
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