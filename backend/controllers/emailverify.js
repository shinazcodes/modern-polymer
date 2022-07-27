var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var crypto = require('crypto');

var User = mongoose.model('User');

// todo host in create transport

module.exports.verifyEmail = function(req, res) {
    console.log("req verify emsil",req)
    if(
        !req.body.email ||
        !req.body.firstName ||
        !req.body.adharNumber ||
        !req.body.lastName ||
        !req.body.streetAddress ||
        !req.body.city ||
        !req.body.state ||
         !req.body.zipCode ||
         !req.body.certificate ||
         !req.body.license ||
         !req.body.adhar ||
         !req.body.pancard ||
         !req.body.passbook ||
         !req.body.photo ||
         !req.body.biodata 
         
    ) {
        res.status(401).json({
            "response": "null",
            "message": "please enter all details"
        }); 
    } else {
var transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
      user: 'shivarajshiva1990@yahoo.com',
      pass: 'cegzxfqmmnbvzkae'
    },
    tls: {
        rejectUnauthorized: false
    }
  });
  
    var user = new User();

    user.email = req.body.email;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.streetAddress = req.body.streetAddress;
    user.city = req.body.city;
    user.state = req.body.state;
    user.zipCode = req.body.zipCode;
    user.adhar = req.body.adhar;
    user.passbook = req.body.passbook;
    user.pancard = req.body.pancard;
    user.biodata = req.body.biodata;
    user.phoneNumber = req.body.phoneNumber;
    user.photo = req.body.photo;
    user.adharNumber = req.body.adharNumber;
    user.license = req.body.license;
    user.adharNumber = req.body.adharNumber;
    user.certificate = req.body.certificate;
    user.userType = req.body.userType;
  console.log("req.body",req.body)
    User.findOne({email: req.body.email}, function (err, doc){
        console.log(""+err);
        console.log(""+doc);
        if(!doc) {
            user.emailToken = crypto.randomBytes(64).toString('hex');  
            user.otp = Math.floor(100000 + Math.random() * 900000);
            console.log(user.otp); 
            var mailOptions = {
                from: 'shivarajshiva1990@yahoo.com',
                to: 'shinazazeez@gmail.com',
                subject: 'Verification Link Pepper Logic' ,
                text: 'here is the verification code: ' + user.otp ,
                // html: `<a href="http://192.168.1.9:4200/password/${user.emailToken}">click here to verify your email and set your password</a>`
                html: `<p>use this otp for hometech sign up: ${user.otp}</p>`
                
            };
            
//             <form action="your://linkhere" target="_blank">
//     <input type="submit" value="value" />
// </form>

// <a href="shinaz://password/${user.emailToken}">click here to verify your email and set your password</a>`

            // transporter.sendMail(mailOptions, function(error, info){
            //     if (error) {
            //     console.log(error);
            //     } else {
            //     console.log('Email sent: ' + info.response);
            //     }
            // });
            
            console.log("transporter new usr")
            user.save(function(err) {
                res.status(200);
                res.json({
                    "response": null,
                    "message": "success! otp  has been sent to your mobile number!"
                });
                
                });
        } else {
            console.log("same user");
            if(!doc){
                res.status(401).json({
                    "response": "error",
                    "message": "user not found"
                }); 
            }
            if(doc.isVerified){
                res.status(401).json({
                    "response": "error",
                    "messsage": "user already exists!!"
                });
            } else {
                User.findOneAndUpdate({email: user.email}, {name: user.name, email: user.email, emailToken: crypto.randomBytes(64).toString('hex'), otp: Math.floor(100000 + Math.random() * 900000)},
                {new: true},

                (err, doc)=> {
                    var mailOptions = {
                        from: 'shivarajshiva1990@yahoo.com',
                        to: 'shinazazeez@gmail.com',
                        subject: 'Verification Link Pepper Logic' ,
                        text: 'here is the verification code: ' + user.otp ,
                        // html: `<a href="http://192.168.1.9:4200/password/${user.emailToken}">click here to verify your email and set your password</a>`
                        html: `<p>use this otp for hometech sign up: ${user.otp}</p>`
                        
                    };
                //       <form action="http://192.168.1.9:4200/password/${doc.emailToken}" target="_blank">
                //       <input type="submit" value="value" />
                //       <div>
                //           click above to verify your email and set your password
                //       </div>
                //   </form>
                    //   <a href="http://localhost:4200/password/${doc.emailToken}">click here to verify your email and set your password</a>`

                      
                    //   transporter.sendMail(mailOptions, function(error, info){
                    //     if (error) {
                    //       console.log(error);
                    //     } else {
                    //       console.log('Email sent: ' + info.response);
                    //     }
                    //   });
                          res.status(200);
                          res.json({
                            "response": null,
                            "message": " otp  has been sent to your mobile number"
                        });
                });
            }
        }
    });
}

}