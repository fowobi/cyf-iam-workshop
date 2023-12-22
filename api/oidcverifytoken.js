const { OidcClient } = require("oidc-client-ts");
const jwt = require("jsonwebtoken");
const { subtle, KeyObject } = require("crypto");

function oidcVerifyToken(config) {
  const metadataService = new OidcClient({
    authority: config.authority,
    client_id: "",
    redirect_uri: "",
  }).metadataService;

  return async (req, res, next) => {
    req.authenticated = false;
    const authHeader = req.headers.authorization;
    if (typeof authHeader === "undefined" || authHeader === "") {
      return next();
    }

    const [tokenType, token] = authHeader.split(" ");

    if (tokenType !== "Bearer") {
      console.log("blah");
      return res.sendStatus(400);
    }

    const signingKeys = await metadataService.getSigningKeys();
    await jwt.verify(
      token,
      async (header, callback) => {
        if (header.alg === "RS256") {
          if (signingKeys != null) {
            const useKey = signingKeys.find((key) => key["kid"] === header.kid);
            if (typeof useKey !== "undefined") {
              const key = await subtle.importKey(
                "jwk",
                useKey,
                { hash: "SHA-256", name: "RSASSA-PKCS1-v1_5" },
                true,
                []
              );
              callback(null, KeyObject.from(key));
            } else {
              return res.sendStatus(401);
            }
          } else {
            return res.sendStatus(401);
          }
        } else {
          return res.sendStatus(401);
        }
      },
      {
        issuer: config.validIss,
        audience: config.validAud,
      },
      (err, token) => {
        if (err !== null) {
          console.log("blah2", err, token);
          return res.sendStatus(400);
        }

        if (typeof token === "string" || typeof token === "undefined") {
          return res.sendStatus(401);
        }

        req.authenticated = true;
        req.userToken = token;
        return next();
      }
    );
  };
}

module.exports = oidcVerifyToken;
