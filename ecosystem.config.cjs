module.exports = {
  apps: [
    {
      name: "alashore-test",
      script: "./server.cjs",
      cwd: "/var/www/testAlashore/ShorelineVision",
      exec_mode: "fork",
      instances: 1,
      node_args: [],
      env: {
        NODE_ENV: "production",
        PORT: 5100,
      },
    },
  ],
};
