export default function handler(req, res) {
  const { echostr } = req.query;

  if (!echostr) {
    res.status(400).send("Missing echostr");
    return;
  }

  res.status(200).send(echostr);
}
