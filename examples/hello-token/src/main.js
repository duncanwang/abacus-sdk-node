const Abacus = require("@abacusprotocol/sdk-node");

const abacus = new Abacus({
  apiKey: "ABAl6le6rs9avyzk0n3nfxlh97a7u0b0d1nao0kn",
  apiSecret: "abasecret_7ivukfkttg8kq8r78rgcgi052n91v02sh9851toqbm2mlhaf12ei",
  applicationId: "e1967099-fb6b-4183-abdc-13b475e1886b",
  apiURL: "https://api-sandbox.abacusprotocol.com"
});

abacus
  .writeAnnotations({
    entityId: {
      tokenAddress: "0x06012c8cf97bead5deae237070f9587f8e7a266d", // cryptokitties
      tokenId: "498583"
    },
    annotations: {
      annotations: {
        offchain: {
          hello: "world"
        }
      },
      commitments: {
        strings: {
          test: "1234"
        }
      }
    }
  })
  .then(result => {
    console.log(result);
  });
