
Meteor.startup(function () {
	process.env.MAIL_URL="smtp://dhurls99%40gmail.com:hockey2399@smtp.gmail.com:465/";

	// Email.send({
	//   from: "meteor.email.2014@gmail.com",
	//   to: "dhurls99@gmail.com",
	//   subject: "Meteor Can Send Emails via Gmail",
	//   text: "Its pretty easy to send emails via gmail."
	// });
});