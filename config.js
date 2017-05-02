const config = {
	host: process.env.JIRA_HOSTNAME,
	port: 443,
	user: process.env.JIRA_USER,
	password: process.env.JIRA_PASSWORD,
	intercom_token: process.env.INTERCOM_ACCESS_TOKEN
}

module.exports = config;
