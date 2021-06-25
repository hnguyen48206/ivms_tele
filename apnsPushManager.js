var apn = require('apn');
var options = {
    token: {
        key: "./pushNotiCert/AuthKey_L72G5CA2L4.p8",
        keyId: "L72G5CA2L4",
        teamId: "JPMH34L85K"
    },
    production: false
};

var apnProvider = new apn.Provider(options);


module.exports = {
    apnProvider: apnProvider,
    createNewNotification() {
        let note = new apn.Notification();
        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 3;
        note.sound = "ping.aiff";
        note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
        note.payload = { 'messageFrom': 'John Appleseed' };
        //Topic in apns means BundleID
        note.topic = "<your-app-bundle-id>";

        apnProvider.send(note, '89999999999999999').then( (result) => {
            // see documentation for an explanation of result
            if(result.failed.length>0)
            {
                console.log(result.failed[0].response)
                console.log('Push apns fail')
            }
          }).catch(err=>{
              console.log(err)
          })
    }
}