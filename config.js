const config = {
	host: process.env.JIRA_HOSTNAME,
	port: 443,
	jira_basicauth: process.env.JIRA_BASICAUTH,
	intercom_token: process.env.INTERCOM_ACCESS_TOKEN
}

module.exports = config;
