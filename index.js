const express = require('express');
const bodyParser = require('body-parser');
const util = require('util')
const config = require('./config.js').get(process.env.NODE_ENV);

const JiraApi = require('jira').JiraApi;
const Jira = new JiraApi('https', config.host, config.port, config.user, config.password, config.apiversion);

const IntercomApi = require('intercom-client');
const Intercom = new IntercomApi.Client({ token: config.intercom_token});


const app = express()

const server = app.listen(3000, function() {
    console.log('Express is listening to http://localhost:3000');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/api/createLink', (req, res, next) => {

	let data = req.body;

	console.log(data)

	// Sample POST Data
	// {
	// 	"intercom": {
	// 		"adminId": 71741,
	// 		"conversationId": 9025833924,
	// 		"url": "https://app.intercom.io/a/apps/vc7jxmzv/conversations/9025833924"
	// 	},
	// 	"jira": {
	// 		"username": "admin",
	// 		"project": "TEST",
	// 		"type": "Bug",
	// 		"priority": "Low",
	// 		"summary": "This is not working properly",
	// 		"description": "This is not working properly because this bug causes app to crash"
	// 	}
	// }

	Jira.addNewIssue({
		project: {
			key: data.jira.project
		},
		issuetype: {
			name: data.jira.type
		},
		priority: {
			name: data.jira.priority
		},
		summary: data.jira.summary,
		description: data.jira.description,
		reporter: {
			name: data.jira.username
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
			        "url" : data.intercom.url,
			        "title": data.jira.summary,
					//"summary": "There's an issue",
			        "icon" : {
			            "url16x16": "https://static.intercomassets.com/assets/favicon-d43b76a6a379bc237a54703bdb91d27a59b43929677efd6fbb722a005ea2a474.png"
			        }
			    }
			};

			Jira.createRemoteLink(issueKey, linkData, (err, link) => {
				console.log('Status: ' + util.inspect(issue, false, null))
				linkIntercom({issue: issue.key, url: config.host + '/browse/' + issue.key})
			});
		}
	})

	const linkIntercom = (jira) => {

		let note = {
			id: data.intercom.conversationId,
			admin_id: data.intercom.adminId,
			body: `Linked to JIRA <b>#${jira.issue}</b>: <a href="https://${jira.url}" target="_blank">${data.jira.summary}</a>`,
			type: 'admin',
			message_type: 'note'
		};

		// Create note in Intercom
		Intercom.conversations.reply(note, (error, response) => {
			if(error){
				console.log(error)
				res.sendStatus(400)
			}
			else{
				console.log(response.body)
				res.status(201).json('Link created')
			}
		});
	}
})

console.log('i am running')
