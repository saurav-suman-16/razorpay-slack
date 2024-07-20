const DPI = require("@DPI");
const { addWorkspaceToContext } = require("./middleware");

const handleTextInput = (text, command) => {
  if (!text) {
    return {};
  }
  let [amount, ...description] = text.split(" ");
  amount = amount && Number(amount);
  if (amount) {
    return { amount: amount * 100, description: description.join(" ") };
  }
  return {};
};

module.exports = (app) => {
  // Action handler for acknowledging request which does not need any response
  app.action("acknowledge_request", async ({ ack }) => {
    await ack();
  });

  // Global error handler
  app.error(async ({ error, logger, context, body }) => {
    // checking for error code seems to be not working as slack internally only uses error message for raising error
    if (error.message === "Workspace not found") {
      // TODO: Remove this if block after we fix the random events for this error
      return Promise.resolve();
    }
    logger.error(
      error,
      "Slack Global Error Handler",
      "slack/handlers/index.js",
      {
        context,
        body,
      }
    );
    return Promise.reject(error);
  });

  // Home tab opened event handler
  app.event(
    "app_home_opened",
    addWorkspaceToContext,
    async ({ event, context, client, logger }) => {
      try {
        if (event.tab !== "home") {
          return Promise.resolve();
        }
        const { workspace } = context;
        logger.info("App Home Opened", "slack/handlers/index.js", event);
        return await client.views.publish({
          user_id: workspace?.memberId,
          view: DPI.get("appHome").appHomeView({
            workspace,
            userId: event?.user,
          }),
        });
      } catch (error) {
        logger.error(
          error,
          "Error Opening Slack App Home",
          "slack/handlers/index.js",
          { context, event }
        );
      }
    }
  );

  // Acton Handler to add razorpay configuration
  app.action(
    "razorpayConfiguration",
    async ({ ack, body, context, client, logger }) => {
      try {
        logger.info(
          "Open Razorpay Configuration",
          "slack/handlers/index.js",
          body
        );
        await client.views.open({
          trigger_id: body.trigger_id,
          view: DPI.get("razorpayConfiguration").setConfigModal(),
        });
        return await ack();
      } catch (error) {
        logger.error(
          error,
          "Error Configuring Razorpay",
          "slack/handlers/index.js",
          { context, body }
        );
      }
    }
  );

  // Action Handler to view razorpay configuration
  app.action(
    "viewRazorpayConfiguration",
    addWorkspaceToContext,
    async ({ ack, body, context, client, logger }) => {
      try {
        logger.info(
          "View Razorpay Configuration",
          "slack/handlers/index.js",
          body
        );
        const { workspace } = context;
        await client.views.open({
          trigger_id: body.trigger_id,
          view: DPI.get("razorpayConfiguration").getConfigModal({
            workspace,
          }),
        });
        return await ack();
      } catch (error) {
        logger.error(
          error,
          "Error Viewing Razorpay Configuration",
          "slack/handlers/index.js",
          { context, body }
        );
      }
    }
  );

  // View Submission Handler for saving razorpay configuration
  app.view(
    "razorpayConfiguration",
    async ({ ack, payload, context, logger, client }) => {
      try {
        logger.info(
          "Save Razorpay Configuration",
          "slack/handlers/index.js",
          payload
        );
        const {
          state: {
            values: { key_id, key_secret },
          },
        } = payload;
        const workspace = await DPI.get("workspacesDBA").findOneAndUpdate(
          { teamID: context.teamId },
          {
            razorpayKeyId: key_id?.key_id?.value,
            razorpayKeySecret: key_secret?.key_secret?.value,
          }
        );
        await client.views.publish({
          user_id: workspace.memberId,
          view: DPI.get("appHome").appHomeView({
            workspace,
            userId: context.userId,
          }),
        });
        ack({
          response_action: "update",
          view: {
            type: "modal",
            title: {
              type: "plain_text",
              text: "Razorpay Configuration",
            },
            blocks: [
              {
                type: "section",
                text: {
                  type: "plain_text",
                  text: "Configuration Saved Successfully",
                },
              },
            ],
          },
        });
      } catch (error) {
        logger.error(
          error,
          "Error Configuring Razorpay",
          "slack/handlers/index.js",
          { context, body }
        );
      }
    }
  );

  // Messages Handler
  app.command(
    "/payment",
    addWorkspaceToContext,
    async ({ command, ack, context, respond, logger }) => {
      try {
        await ack();
        const { workspace } = context;
        // logger.info("Payment Command", "slack/handlers/index.js", command);
        if (!workspace?.razorpayKeyId || !workspace?.razorpayKeySecret) {
          await respond(
            "Razorpay Configuration is not set. Please configure it first from home tab."
          );
        }

        const { amount, description } =
          handleTextInput(command.text, true) || {};
        if (!amount) {
          return await respond(
            "Invalid amount. Please provide a valid amount."
          );
        }

        const { ok, error, url } = await DPI.get(
          "razorpay"
        ).generatePaymentLink({
          amount,
          description,
          workspace,
        });

        if (!ok) {
          return await respond(error);
        }
        return await respond({
          ...DPI.get("botMessages").sendPaymentLink({
            channel: command.channel_id,
            description,
            url,
          }),
          response_type: "in_channel",
        });
      } catch (error) {
        await respond(
          "Error processing payment command, please contact support."
        );
        logger.error(
          error,
          "Error Processing Payment Command",
          "slack/handlers/index.js",
          { context, command }
        );
      }
    }
  );
};
