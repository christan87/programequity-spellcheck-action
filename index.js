// Import the required modules
const fs = require('fs');
const github = require('@actions/github');
const core = require('@actions/core');

// Get the GITHUB_TOKEN environment variable
const token = process.env.GITHUB_TOKEN;
const issueNumber = core.getInput('issue_number');
const owner = core.getInput('owner');
const repo = core.getInput('repo');

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
console.log("====================> context: ", context);

// The createComment function is called in an asynchronous self-invoking function
// This is necessary because top-level await is not allowed in Node.js scripts
(async () => {
    await octokit.issues.createComment({
        owner: owner,
        repo: repo,
        issue_number: issueNumber,
        body: commentBody,
    });
})();