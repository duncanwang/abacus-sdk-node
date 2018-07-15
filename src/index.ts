import JavascriptSDK from "@abacusprotocol/sdk-js";
const jsSHA = require("jssha/src/sha3");

const sha3 = (input: string): string => {
  const d = new jsSHA("SHA3-256", "TEXT");
  d.update(input);
  return d.getHash("HEX");
};

class NodeSDK extends JavascriptSDK {
  _apiSecret: string;

  constructor(params: {
    apiKey: string;
    apiSecret: string;
    applicationId?: string;
    apiURL?: string;
  }) {
    super({
      apiURL: params.apiURL,
      applicationId: params.applicationId,
      authToken: params.apiKey
    });
    this._apiSecret = params.apiSecret;
  }

  async _sendRequest(path: string, mergeOpts: { [key: string]: any } = {}) {
    const method = (mergeOpts.method || "GET").toUpperCase();
    const url = `${this._apiBase}${path}`;
    const body = mergeOpts.body || "";
    const signature = sha3(`${this._apiSecret}${method} ${url}${body}`.trim());
    const res = await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Token " + this._authToken,
        "X-Signature": signature
      },
      ...mergeOpts
    });
    return await res.json();
  }
}

export default NodeSDK;
