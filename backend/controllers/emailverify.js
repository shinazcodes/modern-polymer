var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var crypto = require('crypto');

var User = mongoose.model('User');

// todo host in create transport

module.exports.verifyEmail = function(req, res) {
    console.log("user")
    
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'authpepperlogic@gmail.com',
      pass: 'AuthPepperLogic$1'
    },
    tls: {
        rejectUnauthorized: false
    }
  });
  
    var user = new User();

    user.name = req.body.userName;
    user.email = req.body.email;

    User.findOne({email: req.body.email}, function (err, doc){
        console.log(""+err);
        console.log(""+doc);
        if(!doc) {
            user.emailToken = crypto.randomBytes(64).toString('hex');  
            user.otp = Math.floor(100000 + Math.random() * 900000);
            console.log(user.otp); 
            var mailOptions = {
                from: 'authpepperlogic@gmail.com',
                to: 'shinazazeez@gmail.com',
                subject: 'Verification Link Pepper Logic' ,
                text: 'here is the verification code: ' + user.otp ,
                html: `<a href="http://192.168.1.9:4200/password/${user.emailToken}">click here to verify your email and set your password</a>`
                
            };
            
//             <form action="your://linkhere" target="_blank">
//     <input type="submit" value="value" />
// </form>

// <a href="shinaz://password/${user.emailToken}">click here to verify your email and set your password</a>`

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });
            
            console.log("helloo")
            user.save(function(err) {
                res.status(200);
                res.json({
                    "response": null,
                    "message": "success! email verification link has been sent to your email!"
                });
                
                });
        } else {
            console.log("same user");
            if(!doc){
                res.status(401).json({
                    "response": null,
                    "message": "user not found"
                }); 
            }
            if(doc.isVerified){
                res.status(401).json({
                    "response": null,
                    "messsage": "user already exists!!"
                });
            } else {
                User.findOneAndUpdate({email: user.email}, {name: user.name, email: user.email, emailToken: crypto.randomBytes(64).toString('hex'), otp: Math.floor(100000 + Math.random() * 900000)},
                {new: true},

                (err, doc)=> {
                    var mailOptions = {
                        from: 'authpepperlogic@gmail.com',
                        to: 'shinazazeez@gmail.com',
                        subject: 'Verification Link Pepper Logic',
                        text: `` ,
                        html: 
                        `<a href="http://192.168.1.9:4200/password/${doc.emailToken}">click here to verify your email and set your password</a><br>
                        <div>or use this otp and verify your email: ${doc.otp}</div>`
                      };
                //       <form action="http://192.168.1.9:4200/password/${doc.emailToken}" target="_blank">
                //       <input type="submit" value="value" />
                //       <div>
                //           click above to verify your email and set your password
                //       </div>
                //   </form>
                    //   <a href="http://localhost:4200/password/${doc.emailToken}">click here to verify your email and set your password</a>`

                      
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });
                          res.status(200);
                          res.json({
                            "response": null,
                            "message": "success! email verification link has been sent to your email!"
                        });
                });
            }
        }
    });
    console.log("helloo")

}