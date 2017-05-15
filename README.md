# Jira and Intercom integration
A small app that works as an API for the [Jira integration with Intercom extension](https://chrome.google.com/webstore/detail/jira-integration-with-int/eghmlkojhdkdcipgnnfipggpaddinegg).

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/mwilen/jira_intercom_integration)

## Prerequisites
An Intercom Access Token and JIRA account and user is required

*Note: The JIRA user has to have access to the JIRA Project you'll be creating issues in*

**Details for the Jira Account (username and password) is *only* saved in the Heroku application. The account credentials has to be a [Base64 String](https://mwilen.github.io/jira_intercom_integration/) of username:password.**
