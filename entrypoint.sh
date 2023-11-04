#!/bin/sh

# This script is the entrypoint for the Docker container

# Run cspell with any arguments passed to the script
# The "$@" is a special variable that holds all command-line arguments
# The output is redirected to spellcheck-results.txt
cspell "$@" > /workdir/spellcheck-results.txt
echo "Running cspell with arguments: $@"
output=$(cspell "$@")
echo "Output of cspell command: $output"
echo $output > /workdir/spellcheck-results.txt
# Run the Node.js script named index.js
node index.js