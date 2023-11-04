# This Dockerfile sets up a Node.js environment and installs the cspell package globally
FROM node:16

# Update the package list in the base image
# This is necessary to ensure all subsequent apt-get commands run without issue
RUN apt-get update

# Install cspell globally using npm
# cspell is a spell checker for code
RUN npm install -g cspell

# Install the @actions/github module
RUN npm install @actions/github

# Copy the entrypoint.sh script into the Docker image
COPY entrypoint.sh /entrypoint.sh

# Make the entrypoint.sh script executable
RUN chmod +x /entrypoint.sh

# Set entrypoint.sh as the entrypoint for the Docker container
ENTRYPOINT ["/entrypoint.sh"]

# Clean up APT cache and remove unnecessary files to reduce image size
# This is a good practice to keep the Docker image size small
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*