const loginSchema = {
    RespostaLogin: {
        type: 'object',
        properties: {
        },
        example:{
            message: 'Token gerado com sucesso!',
            error: false,
            code: 200,
            data: {
                'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzMwODU3MjA3LCJleHAiOjE3MzM0NDkyMDd9.b4VQcQSl7oK9BOaCoL1JZ4EiZF4TTgNBk2-asdqwe'
            }
        }
    }
};
export default loginSchema;
