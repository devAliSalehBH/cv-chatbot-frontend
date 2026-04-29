module.exports = {
    apps: [
        {
            name: "cv-chatbot-frontend",
            script: "npm",
            args: "start",
            cwd: "/var/www/testing/cv-chatbot-platform",
            env: {
                NODE_ENV: "production",
                PORT: 3001,
            },
        },
    ],
};
