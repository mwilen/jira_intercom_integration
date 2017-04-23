const express = require('express');
const bodyParser = require('body-parser');
const util = require('util')

const config = require('./config')

JiraApi = require('jira').JiraApi;
const Jira = new JiraApi('https', config.host, config.port, config.user, config.password, config.apiversion);

const IntercomApi = require('intercom-client');
const Intercom = new IntercomApi.Client({ token: 'dG9rOjRlNjIwMGMxXzgzMWVfNDViMl84OWRlXzE5ZjVhOWM0YWExODoxOjA=' });

const app = express()

const server = app.listen(3000, function() {
    console.log('Express is listening to http://localhost:3000');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const linkIntercom = (data) => {

	let reply = {
		id: '9025833924',
		intercom_user_id: '71741',
		body: 'Some reply :)',
		type: 'admin',
		message_type: 'note'
	};

	Intercom.conversations.reply(reply, (error, response) => {
		if(error){
			console.log(error)
		}
		else{
			console.log(response)
		}
	});
}
linkIntercom()

app.post('/api/createLink', (req, res, next) => {

	Jira.addNewIssue({
		project: {
			key: 'TEST'
		},
		issuetype: {
			name: 'Bug'
		},
		summary: 'Lorem ipsum',
		description: 'Lorem ipsum description',
		reporter: {
			name: 'admin'
		}
	},
	(error, issue) => {
		if(error){
			console.log('Error:', error)
			res.sendStatus(400)
		}
		else{

			let issueKey = issue.key;
			console.log('Status: ' + util.inspect(issue, false, null));
			console.log('Issue created')

			let linkData = {
				"relationship": "causes",
			    "object": {
			        "url" : "https://www.youtube.com/watch?v=G26HX51Xx5Q",
			        "title": "Add getVersions and createVersion functions",
					"summary": "There's an issue",
			        "icon" : {
			            "url16x16": "https://github.com/favicon.ico"
			        }
			    }
			};

			Jira.createRemoteLink(issueKey, linkData, (err, link) => {
				console.log('Status: ' + util.inspect(issue, false, null))
				res.status(201).json('Link created')
				linkIntercom({issue: issue.key, url: config.host + '/browse/' + issue.key})
			});
		}
	})
})

console.log('i am running')
