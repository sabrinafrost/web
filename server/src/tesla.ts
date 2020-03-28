import * as cryptoJS from "crypto-js";

const { encrypt, decrypt } = require("./utilities.ts");
const tryCatch = require("try-catch");
// const { validate, webRequest, encryption, errors } = require("./middleware/index");
const { webRequest } = require("./middleware/web-request");
// const { encrypt, decrypt } = require("./middleware/encryption");
const errors = require("./middleware/errors");
const validate = require("./middleware/validate");

let functions = {
  api: (endpoint, data, method = "post", additionalHeaders = {}) => {
    return {
      url: `https://owner-api.teslamotors.com${endpoint}`,
      method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15",
        ...additionalHeaders
      },
      data: {
        client_id:
          "81527cff06843c8634fdc09e8ac0abefb46ac849f38fe1e431c2ef2106796384",
        client_secret:
          "c7257eb71a564034f9419ee651c7d0e5f7aa6bfbd18bafb5c5c033b093bb2fa3",
        ...data
      }
    };
  },
  decryptAndValidate: req => {
    console.log(req)
    const data = decrypt(req.headers.data, req.headers.encryption_key);
    const [decryptionError, decryptionResult] = tryCatch(
      JSON.parse,
      data
    );

    if (decryptionError) errors.new(400, exports.strings.decryptionFailure);

    const dataValidation = validate.data(decryptionResult, {
      vehicle_name: { presence: true },
      vehicle_id: { presence: true },
      email_address: { presence: true, email: true },
      "authentication.access_token": { presence: true },
      "authentication.token_type": { presence: true },
      "authentication.expires_in": { presence: true },
      "authentication.refresh_token": { presence: true },
      "authentication.created_at": { presence: true }
    });

    if (dataValidation) return false;
    return decryptionResult;
  }
};

let strings = {
  malformedData:
    "The encrypted data is malformed. Please generate a new encrypted Tesla configuration",
  encryptionFailure: "Failed to encrypt data",
  decryptionFailure: "Failed to decrypt data",
  authenticationFailure: (reason = null) => {
    if (reason) return `Failed to authenticate with Tesla: ${reason}`;
    else return "Failed to authenticate with Tesla";
  },
  fetchDataFailure: (description, reason = null) => {
    if (reason) return `Failed to fetch ${description} from Tesla: ${reason}`;
    else return `Failed to fetch ${description} from Tesla`;
  },
  refreshTokenFailure:
    "Unable to generate a new token. That refresh token may have already been used",
  revokeTokenFailure: "Unable to revoke token",
  noVehicles: "No vehicles found in this account"
};

exports.auth = {
  new: async (req, reply) => {
    const auth = await webRequest(
      functions.api("/oauth/token", {
        grant_type: "password",
        email: req.headers.tesla_email,
        password: req.headers.tesla_password
      })
    );

    if (auth.error)
      errors.new(400, strings.authenticationFailure(auth.error.message));

    const vehicles = await webRequest(
      functions.api("/api/1/vehicles", {}, "get", {
        Authorization: `bearer ${auth.access_token}`
      })
    );

    if (vehicles.error)
      errors.new(
        500,
        strings.fetchDataFailure("vehicle data", vehicles.error.message)
      );

    const vehicleArray = [];
    if (vehicles.response) {
      vehicles.response.forEach(vehicle => {
        const vehicleObject = {};
        const vehicleData = {
          vehicle_name: vehicle.display_name,
          vehicle_id: vehicle.id,
          email_address: req.headers.tesla_email,
          authentication: auth
        };
        const encryptedData = encrypt(
          JSON.stringify(vehicleData),
          req.headers.encryption_key
        );

        if (!encryptedData) errors.new(500, strings.encryptionFailure);

        vehicleObject[vehicle.display_name] = encryptedData;
        vehicleArray.push(vehicleObject);
      });
    }

    if (vehicleArray.length === 0) throw errors.new(400, strings.noVehicles);

    reply.send(JSON.stringify(vehicleArray));
  },
  refresh: async (req, reply) => {
    const data = functions.decryptAndValidate(req);
    if (!data) errors.new(400, strings.malformedData);
    const auth = await webRequest(
      functions.api("/oauth/token", {
        grant_type: "refresh_token",
        email: data.email_address,
        refresh_token: data.authentication.refresh_token
      })
    );
    
    if (auth.error) {
      if (auth.error.message === "Unknown error")
        errors.new(400, strings.refreshTokenFailure);
      errors.new(400, strings.authenticationFailure(auth.error.messsage));
    }
    
    data.authentication = auth;

    reply.send(
      encrypt(JSON.stringify(data), req.headers.encryption_key)
    );
  },
  delete: async (req, reply) => {
    const data = functions.decryptAndValidate(req);
    if (!data) errors.new(400, strings.malformedData);
    const auth = await webRequest(
      functions.api("/oauth/revoke", {
        token: data.authentication.access_token
      })
    );
    
    if (auth.error) {
      if (auth.error.message === "Unknown error")
        errors.new(400, strings.revokeTokenFailure);
      errors.new(400, strings.authenticationFailure(auth.error.messsage));
    }
    
    data.authentication = auth;

    reply.send('Token has been revoked');
  }
};

// exports.command = {
//   new: async (req, reply) => {
//     reply.send("newo")
//   },
//   refresh: async (req, reply) => {
//     reply.send("newo")
//   },
//   delete: async (req, reply) => {
//     reply.send("newo")
//   }
// }
