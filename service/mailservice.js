const sgMail = require('@sendgrid/mail')

const MailService=async({email,subject,firstName,lastName,message1,message2,message3})=>{
    sgMail.setApiKey('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')
const msg = {
  to: `${email}`, // Change to your recipient
  from: 'sham29.b@gmail.com', // Change to your verified sender
  subject: `${subject}`,
  text: 'and easy to do anywhere, even with Node.js',
  html: `
  <div style="background-color: rgb(172, 118, 223); display: flex; flex-direction: column;align-items: center; justify-content: center; padding: 20px;margin: 50px 200px 0 200px;">
        <div>Hi,${firstName} ${lastName},</div>
        <div style="margin: 20px;"> ${message1}</div>
        <div style="margin: 20px;">${message2} </div>
        <div style="margin: 20px;">${message3}</div>
        <footer style="text-align: center;">
            Azam Technologies Pvt Ltd., Trichy
        </footer>
    </div>
  `,
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}

module.exports={MailService}