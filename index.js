// Import the required modules
const fs = require('fs');
const github = require('@actions/github');
const core = require('@actions/core');

// Get the GITHUB_TOKEN environment variable
const token = process.env.GITHUB_TOKEN;
console.log("====================> token: ", token);
// Create an authenticated Octokit client
const octokit = github.getOctokit(token);

// Read the spellcheck-results.txt file
// This file contains the output of the cspell command
const data = fs.readFileSync('spellcheck-results.txt', 'utf8');

// Extract the misspelled words from the file content
// The regular expression matches any word that follows "Unknown word (" and ends before ")"
let misspelledWords = data.match(/(?<=Unknown word \().*?(?=\))/g);

// If misspelledWords is null, set it to an empty array
if (misspelledWords === null) {
  misspelledWords = [];
}

// Format the misspelled words as a comment body
// Each misspelled word is on a new line
const commentBody = `The following words are misspelled:\n\n${misspelledWords.join('\n')}`;

// Post the comment to the pull request

//const context = github.context;
const context = {
    eventName: process.env.GITHUB_EVENT_NAME,
    sha: process.env.GITHUB_SHA,
    ref: process.env.GITHUB_REF,
    repo: {
        owner: process.env.GITHUB_REPOSITORY.split('/')[0],
        repo: process.env.GITHUB_REPOSITORY.split('/')[1],
    },
    actor: process.env.GITHUB_ACTOR,
};
console.log("====================> context: ", context);
console.log("====================> process.env.GITHUB_ISSUE_NUMBER: ", process.env.GITHUB_ISSUE_NUMBER);
// The createComment function is called in an asynchronous self-invoking function
// This is necessary because top-level await is not allowed in Node.js scripts
(async () => {
    await octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: process.env.GITHUB_ISSUE_NUMBER,
        body: commentBody,
    });
})();