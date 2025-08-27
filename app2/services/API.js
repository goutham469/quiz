const SERVER_URL = 'https://quiz-server.iamgoutham.in'

export default API = {
    'register': async( data ) => {
        try{
            const response = await fetch(`${SERVER_URL}/user/register`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify( data )
            })
            return await response.json()
        }catch(err){
            return{
                success:false,
                error:"Network error"
            }
        }
    },
    'request_otp': async( data ) => {
        try{
            const response = await fetch(`${SERVER_URL}/user/send-otp`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify( data )
            })
            return await response.json()
        }catch(err){
            return{
                success:false,
                error:"Network error"
            }
        }
    },
    'login': async( data ) => {
        try{
            const response = await fetch(`${SERVER_URL}/user/login`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify( data )
            })
            return await response.json()
        }catch(err){
            return{
                success:false,
                error:"Network error"
            }
        }
    },
    'get_categories': async() => {
        try{
            const response = await fetch(`${SERVER_URL}/quiz/get-categories` )
            return await response.json()
        }catch(err){
            return{
                success:false,
                error:"Network error"
            }
        }
    },
    'get_questions': async( data ) => {
        try{
            const response = await fetch(`${SERVER_URL}/quiz/questions?category=${data.category}&count=${data.count}`)
            return await response.json()
        }catch(err){
            return{
                success:false,
                error:"Network error"
            }
        }
    },
    'user_stats': async( data ) => {
        try{
            const response = await fetch(`${SERVER_URL}/user/login`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify( data )
            })
            return await response.json()
        }catch(err){
            return{
                success:false,
                error:"Network error"
            }
        }
    },
    'user_attempts': async( data ) => {
        try{
            const response = await fetch(`${SERVER_URL}/quiz/attempts?email=${data.email}`)
            return await response.json()
        }catch(err){
            return{
                success:false,
                error:"Network error"
            }
        }
    },
    'submit_test': async( data ) => {
        try{
            const response = await fetch(`${SERVER_URL}/quiz/submit`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify( data )
            })
            return await response.json()
        }catch(err){
            return{
                success:false,
                error:"Network error"
            }
        }
    }
}