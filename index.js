// Import the required modules
const fs = require('fs');
const github = require('@actions/github');

// Read the spellcheck-results.txt file
// This file contains the output of the cspell command
const data = fs.readFileSync('spellcheck-results.txt', 'utf8');

// Extract the misspelled words from the file content
// The regular expression matches any word that follows "Unknown word (suggestion): " and ends before a comma
const misspelledWords = data.match(/(?<=Unknown word \(suggestion\): ).*?(?=,)/g);

console.log("===================>data: ", data);
console.log("===================>misspelledWords: ", misspelledWords);
// Format the misspelled words as a comment body
// Each misspelled word is on a new line
const commentBody = `The following words are misspelled:\n\n${misspelledWords.join('\n')}`;

// Post the comment to the pull request
// The GitHub token is read from the environment variables
const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
const context = github.context;

// The createComment function is called in an asynchronous self-invoking function
// This is necessary because top-level await is not allowed in Node.js scripts
(async () => {
    await octokit.issues.createComment({
        ...context.repo,
        issue_number: context.issue.number,
        body: commentBody,
    });
})();