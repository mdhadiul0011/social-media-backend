const nodemailer = require("nodemailer");
const {google} = require("googleapis")

// const {OAuth2} = google.auth
const oauth_link = "https://developers.google.com/oauthplayground"
const {EMAIL, MAILLING_ID, MAILLING_SECRET, MAILLING_REFRESH, MAILLING_ACCESS} = process.env;

const OAuth2Client  = new google.auth.OAuth2(
    MAILLING_ID,
    MAILLING_SECRET,
    MAILLING_REFRESH,
    MAILLING_ACCESS,
    oauth_link
)

OAuth2Client.setCredentials({ refresh_token: MAILLING_REFRESH });

const sendVerificationMail = async (email, name, url)=> {
    try {
        const accessToken = await OAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: EMAIL,
            clientId: MAILLING_ID,
            clientSecret: MAILLING_SECRET,
            refreshToken: MAILLING_REFRESH,
            accessToken: accessToken
          },
        });
        const mailOptions = {
          from: EMAIL,
          to: email,
          subject: "Social Media Verification",
          text: "Social Media Verification",
          html: ` <div style="border: 1px solid #ddd; border-radius: 5px; text-align: center; padding: 20px; background: dimgrey; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;"> <h1 style="color: azure;">Hey <span style="color: aqua;">${name}</span> You Got An Email</h1> <p style="font-size: 16px; color: beige;">Hello ${name} hope you are well. Please confirm your verification email to join with us.</p> <a href= ${url} style="text-decoration: none;"> <button style="padding: 12px 18px; border: none; border-radius: 5px; font-size: 16px; color: #222;" onmouseenter="this.style.background='#2222'" onmouseleave="this.style.background='azure'" >Verify Email</button> </a> </div>`
        };
        const result = transport.sendMail(mailOptions, (err, res) => {
          if (err) return err;
          return res;
        });
        return result;
      } catch (error) {
        console.log(error);
      }
}

module.exports = sendVerificationMail;