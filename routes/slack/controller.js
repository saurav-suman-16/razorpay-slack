const DPI = require('@DPI');
const config = require('config');

// Maintains a map of current events to control the redundancy in events
const events = {};

exports.events = async (req, res) => {
  try {
    if(events[req.body?.event_id]) {
      return res.sendStatus(200);
    }
    events[req.body?.event_id] = true;
    setTimeout(() => delete events[req.body?.event_id], config.eventTimeout || 0);
    await DPI.get('slackManager').slackEvents({ payload: req.body });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
};

exports.interactive = async (req, res) => {
  try {
    const result = await DPI.get('slackManager').interactiveEvents({ payload: JSON.parse(req.body.payload) });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
};

exports.commands = (req, res) => {
  try {
    console.log('commands req', req.body);
    res.send(200);
  } catch (error) {
    res.send(error);
  }
};

exports.install = async (req, res) => {
  try {
    const redirectUrl = await DPI.get('slackManager').appInstall({
      code: req.query.code,
    });
    res.redirect(redirectUrl);
  } catch (error) {
    res.json({ error: error.message });
  }
};
