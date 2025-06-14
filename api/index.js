const crypto = require("crypto");

const TOKEN = "hYWhKphKb3uwifTkOjUYAY";
const ENCODING_AES_KEY = "FXmX10hvcWZo1FYXmuTicGZVXdfzr99KfoPDD9mUDVq";
const AES_KEY = Buffer.from(ENCODING_AES_KEY + "=", "base64");
const IV = AES_KEY.slice(0, 16);

function decryptEchoStr(encrypted) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", AES_KEY, IV);
  decipher.setAutoPadding(false);
  let decrypted = Buffer.concat([
    decipher.update(encrypted, "base64"),
    decipher.final()
  ]);

  const pad = decrypted[decrypted.length - 1];
  decrypted = decrypted.slice(0, decrypted.length - pad);

  const content = decrypted.slice(20);
  const length = content.readUInt32BE(0);
  return content.slice(4, 4 + length).toString();
}

module.exports = async (req, res) => {
  const { msg_signature, timestamp, nonce, echostr } = req.query;

  if (!msg_signature || !timestamp || !nonce || !echostr) {
    res.status(400).send("Missing parameters");
    return;
  }

  const arr = [TOKEN, timestamp, nonce, echostr].sort();
  const sha1 = crypto.createHash("sha1").update(arr.join("")).digest("hex");

  if (sha1 !== msg_signature) {
    res.status(403).send("Invalid signature");
    return;
  }

  try {
    const decoded = decryptEchoStr(echostr);
    res.status(200).send(decoded);
  } catch (err) {
    console.error("Decryption failed:", err);
    res.status(500).send("Decryption failed");
  }
};
