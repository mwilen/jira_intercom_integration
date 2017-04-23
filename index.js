const express = require('express');
const bodyParser = require('body-parser');
const util = require('util')

JiraApi = require('jira').JiraApi;

const Jira = new JiraApi('https', 'mwilen.atlassian.net', 443, 'mathias.wilen@gmail.com', 'kxcvwq4165', '2');

const app = express()

const server = app.listen(3000, function() {
    console.log('Express is listening to http://localhost:3000');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Jira.findIssue('TEST-1', (error, issue) => {
// 	if(error)
// 		console.log('Error:', error)
// 	else
// 		console.log('Status: ' + util.inspect(issue.fields, false, null));
// });

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

			var issueKey = issue.key;
			console.log('Status: ' + util.inspect(issue, false, null));
			console.log('Issue created')

			var linkData = {
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
				console.log('Status: ' + util.inspect(link, false, null));
				res.status(201).json('Link created')
			});
		}
	})
})

console.log('i am running')
