module.exports=(req,res)=>{res.setHeader('Set-Cookie',`vci_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${process.env.VERCEL ? '; Secure' : ''}`);res.status(200).json({ok:true});};
