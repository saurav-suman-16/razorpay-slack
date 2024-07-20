const DPI = require("@DPI");

exports.addWorkspaceToContext = async ({ context, next, ack }) => {
  try {
    const { teamId } = context;
    const workspace = await DPI.get("workspacesDBA").findOne({
      teamID: teamId,
    });
    if (ack) {
      if (!workspace?.accessToken) {
        return await ack();
      }
    } else {
      Promise.resolve();
    }
    context.workspace = workspace;
    return await next();
  } catch (error) {
    console.error(error);
    ack();
  }
};
