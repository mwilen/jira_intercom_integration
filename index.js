const express = require('express');
const bodyParser = require('body-parser');
const util = require('util')
const config = require('./config.js').get(process.env.NODE_ENV);

const JiraApi = require('jira-client');
const Jira = new JiraApi({
	protocol: 'https',
	host: config.host,
	port: config.port,
	username: config.user,
	password: config.password,
	apiVersion: '2',
	strictSSL: true
});

const IntercomApi = require('intercom-client');
const Intercom = new IntercomApi.Client({ token: config.intercom_token});

const app = express()
const server = app.listen(3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/createLink', (req, res, next) => {

	let data = req.body;
	let issueKey = '';

	// Sample POST Data
	// {
	// 	"intercom": {
	// 		"adminId": 71741,
	// 		"conversationId": 9025833924,
	//		"name": "Mathias Wilén"
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
		fields: {
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
		}
	})
	.then(issue => {

		issueKey = issue.key;

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

		return Jira.createRemoteLink(issueKey, linkData)
	})
	.then(link => {
		console.log(link, issueKey)
		console.log('Status: ' + util.inspect(link, false, null))
		let jiraLinkUrl = config.host + '/browse/' + issueKey

		let note = {
			id: data.intercom.conversationId,
			admin_id: data.intercom.adminId,
			body: `Linked to <a href="https://${jiraLinkUrl}" target="_blank">JIRA</a> #${issueKey}: <a href="https://${jiraLinkUrl}" target="_blank"><b>${data.jira.summary}</b></a>
			<b>Priority:</b> ${data.jira.priority}
			<b>Type:</b> ${data.jira.type}
			<b>Description:</b> ${data.jira.description}
			<br>Opened by ${data.intercom.name}`,
			type: 'admin',
			message_type: 'note'
		};

		// Create note in Intercom
		return Intercom.conversations.reply(note)
	})
	.then(intercomNote => {
		console.log(intercomNote.body)
		res.status(201).json('Link created')
	})
	.catch(error => {
		if(error){
			console.log('Error:', error)
			res.sendStatus(400)
		}
	})
})
