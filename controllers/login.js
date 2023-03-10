require('dotenv').config()
const bcrypt=require('bcrypt')
const account=require('../models/account')
const jwt=require('jsonwebtoken')

const login= async (req,res)=>{
    try {
        const{email, password}=req.body

        const checkEmail=await account.getUserByEmail({email})
        if(checkEmail?.length===0){
            throw 'Email tidak terdaftar'
        }

        bcrypt.compare(password, checkEmail[0].password,
        (err,result)=>{
            try {
                
                if(err){
                    throw {code:500,message:'ada kesalahan pada server'}
                }

                const token=jwt.sign({
                    id:checkEmail[0]?.id,
                    username:checkEmail[0]?.username,
                    email:checkEmail[0]?.email,
                    iat:new Date().getTime()
                }, process.env.JWT_KEY,{
                    expiresIn:'1h'
                })

                if(result){
                    res.status(200).json({
                        status: true,
                        message: 'Login berhasil',
                        data: {
                            token,
                            profile:checkEmail[0]
                        },
                      })
                }else{
                    throw {code:400, message:'Email atau Password yang anda masukkan salah'}
                }
            } catch (error) {
                res.status(error?.code??500).json({
                    status: false,
                    message: error?.message ?? error,
                    data: []
                  })
            }
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error?.message ?? error,
            data: []
          })
    }
}

module.exports={ login }