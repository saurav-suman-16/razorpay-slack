const { App, ExpressReceiver } = require("@slack/bolt");
const DPI = require("@DPI");
const secrets = require("./src/utils/secrets");

const receiver = new ExpressReceiver({
  clientId: secrets.get("slack_clientId"),
  clientSecret: secrets.get("slack_clientSecret"),
  signingSecret: secrets.get("slack_signingSecret"),
  stateSecret: secrets.get("slack_stateSecret"),
  scopes: ["commands", "im:history", "chat:write"],
  unhandledRequestHandler: (param) => {
    console.error(
      `Request to ${param.request.url} with ${JSON.stringify(
        param.request.body
      )} did not match any route`
    );
  },
  installerOptions: {
    stateVerification: false,
  },
  installationStore: {
    storeInstallation: async (installation) => {
      await DPI.get("workspacesDBA").findOneAndUpdate(
        { teamID: installation?.team?.id },
        {
          teamID: installation?.team?.id,
          teamName: installation?.team?.name,
          memberId: installation?.user?.id,
          accessToken: installation?.bot?.token,
          scopes: installation?.bot?.scopes.join(","),
          botUserID: installation?.bot?.userId,
        }
      );
    },
    fetchInstallation: async (installQuery, p2) => {
      const workspace = await DPI.get("workspacesDBA").findOne({
        teamID: installQuery.teamId,
      });
      if (!workspace) {
        const error = new Error("Workspace not found");
        error.code = 404;
        throw error;
      }
      return {
        team: {
          id: workspace.teamID,
          name: workspace.teamName,
        },
        bot: {
          token: workspace.accessToken,
          scopes: workspace.scopes.split(","),
          userId: workspace.botUserID,
        },
        isEnterpriseInstall: false,
        tokenType: "bot",
      };
    },
    deleteInstallation: async (installQuery) => {
      console.log("deleteInstallation", installQuery);
    },
  },
});

const app = new App({ receiver });

module.exports = { app, receiver };
