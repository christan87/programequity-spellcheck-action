// Import the required modules
const fs = require('fs');
const github = require('@actions/github');
const core = require('@actions/core');

// Get the GITHUB_TOKEN environment variable
const token = process.env.GITHUB_TOKEN;

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

const context = github.context;
const prNumber = github.context.payload.pull_request.number;
console.log("====================> prNumber: ", prNumber);

// The createComment function is called in an asynchronous self-invoking function
// This is necessary because top-level await is not allowed in Node.js scripts
(async () => {
    await octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: context.issue.number,
        body: commentBody,
    });
})();