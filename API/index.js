// api/index.js

export default function handler(req, res) {
  const { msg_signature, timestamp, nonce, echostr } = req.query;

  if (!msg_signature || !timestamp || !nonce || !echostr) {
    res.status(400).send("Missing parameters");
    return;
  }

  // Простой ответ для проверки
  res.status(200).send(echostr);
}
