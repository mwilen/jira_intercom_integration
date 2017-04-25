const config = {
	development: {
		host: "mwilen.atlassian.net",
		port: 443,
		user: "mathias.wilen@gmail.com",
		password: "kxcvwq4165",
		intercom_token: "dG9rOjRlNjIwMGMxXzgzMWVfNDViMl84OWRlXzE5ZjVhOWM0YWExODoxOjA="
	},
	production: {
		host: process.env.JIRA_HOSTNAME,
		port: 443,
		user: process.env.JIRA_USER,
		password: process.env.JIRA_PASSWORD,
		intercom_token: process.env.INTERCOM_ACCESS_TOKEN
	}
}

exports.get = function get(env) {
	return config[env] || config.development;
}
