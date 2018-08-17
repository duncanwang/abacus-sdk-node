const fetch = require("isomorphic-unfetch");
import JavascriptSDK from "@abacusprotocol/sdk-js";
import * as FormData from "form-data";
import { ReadStream } from "fs";
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

  /**
   * Uploads a file to an applicationn.
   */
  async uploadFile({
    applicationId,
    file
  }: {
    applicationId?: string;
    file: ReadStream;
  }) {
    const appId = applicationId || this._applicationId;
    if (!appId) {
      throw new Error("No application id specified");
    }
    const form = new FormData();
    form.append("file", file);
    const url = `${this._apiBase}/applications/${appId}/files/upload`;
    const res = await fetch(url, {
      headers: {
        "Content-Type": "multipart/formdata",
        Authorization: "Token " + this._authToken
      },
      method: "POST",
      body: form
    });
    return await res.json();
  }
}

export default NodeSDK;
