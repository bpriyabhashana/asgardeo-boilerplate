import { OAUTH_CONFIG, APIM_HEADERS, APIM_CLIENT } from "../Config";
export const DEFINED_ACCESS = {
  VIEW: { name: "VIEW", level: 0 },
  EDIT: { name: "EDIT", level: 1 },
  CREATE: { name: "CREATE", level: 2 },
  ADMIN: { name: "ADMIN", level: 3 },
  SUPER: { name: "SUPER", level: 4 },
};

var idToken = null;
var userName = "";
var userRoles = [];
var refreshTokenFunction = null;
var userAccess = DEFINED_ACCESS.VIEW;
var userRolesToAccessMap = {};
var apiToken = null;
var authError = false;

export async function setIdToken(token) {
  idToken = token;
}

export function getIdToken() {
  return idToken;
}

export function setAuthError(error) {
  authError = error;
}

export function getAuthError() {
  return authError;
}

export async function refreshToken(callback) {
  if (refreshTokenFunction) {
    try {
      let returnedIdToken = await refreshTokenFunction();
      returnedIdToken && setIdToken(returnedIdToken);
      if (OAUTH_CONFIG.SKIP_TOKEN_EXCHANGE) {
        callback && callback();
      } else {
        getNewAPIToken(callback);
      }
    } catch (e) {
      console.error("Could not refresh access token!");
    }
  }
}

export function setRefreshTokenFunction(refreshFunction) {
  refreshTokenFunction = refreshFunction;
}

function setToken(token) {
  apiToken = token;
}

export function getToken() {
  return OAUTH_CONFIG.SKIP_TOKEN_EXCHANGE
    ? OAUTH_CONFIG.BEARER_TOKEN
    : apiToken;
}

export function setUserName(user) {
  userName = user;
}

export function getUserName() {
  return userName;
}

export function setUserRoles(rolesFromJWT) {
  if (typeof rolesFromJWT === "string") {
    userRoles = rolesFromJWT.split(",");
  } else if (Array.isArray(rolesFromJWT)) {
    userRoles = rolesFromJWT.slice();
  }
}

export function getUserRoles() {
  return userRoles;
}

export function setUserAccessMap(map, callback) {
  userRolesToAccessMap = map;
  setAccess(callback);
}

// Sets the highest access the user has
function setAccess(callback) {
  let highestAccess = DEFINED_ACCESS.VIEW;
  let highestAccessPosition = DEFINED_ACCESS.VIEW.level;
  userRoles.forEach((role) => {
    let roleAccess = userRolesToAccessMap[role];
    if (roleAccess && DEFINED_ACCESS[roleAccess]) {
      let accessPositionForRole = DEFINED_ACCESS[roleAccess].level;
      if (accessPositionForRole > highestAccessPosition) {
        highestAccess = DEFINED_ACCESS[roleAccess];
        highestAccessPosition = DEFINED_ACCESS[roleAccess].level;
      }
    }
  });
  userAccess = highestAccess;
  callback && callback();
}

export function checkForUserAccess(accessRequired, owner) {
  if (owner && owner === getUserName(owner)) {
    return true;
  }
  if (
    accessRequired &&
    accessRequired.name &&
    DEFINED_ACCESS[accessRequired.name]
  ) {
    let requiredAccessLevel = DEFINED_ACCESS[accessRequired.name].level;
    // Gives access if the required level of access is the same or lower than the users access
    if (userAccess.level >= requiredAccessLevel) {
      return true;
    }
  }
  return false;
}

var getNewAPITokenTries = 0;
// export async function getNewAPIToken(callback) {
//     if (!idToken || !idToken.length) {
//         return null;
//     }

//     let headers;

//     headers = {
//         "token": idToken
//     };

//     try {
//         const fetchResult = fetch(OAUTH_CONFIG.TOKEN_APIS.ASGARDEO_TOKEN_EXCHANGE, {
//             method: "GET",
//             headers: headers
//         });
//         const response = await fetchResult;
//         const jsonData = await response.json();

//         /** Choreo Token endpoint sample responseJSON
//         {
//             "access_token": "xxxxxxxxx",
//             "issued_token_type": "urn:ietf:params:oauth:token-type:jwt",
//             "scope": "default",
//             "token_type": "Bearer",
//             "expires_in": 3600
//         }
//         */

//         if (response.ok) {
//             if (jsonData) {
//                 let accessToken = jsonData?.data?.header?.access_token;
//                 if (accessToken) {
//                     getNewAPITokenTries = 0;
//                     setToken(accessToken);
//                     callback && callback();
//                 } else {
//                     //Checking for callback avoids infinite looping
//                     if(!callback && getNewAPITokenTries < 4){
//                         getNewAPITokenTries++;
//                         refreshToken();
//                     }
//                 }
//             }
//         } else {
//             console.error("Error when calling token endpoint! ", response.status, " ", response.statusText);
//             switch (response.status) {
//                 case 404:
//                     return "Looks like the services of the application are under maintenance at the moment. Please try again in a few minutes.";
//                 case 401:
//                     return "It seems that the services of the application are temporarily inaccessible. Please contact the Internal Apps Team if this continues.";
//                 default:
//                     return "The application seems to have run into an issue! Try reloading the page. Please contact the Internal Apps Team if this continues.";
//             }
//         }
//     } catch (exception) {
//         return "Looks like the services of the application are under maintenance or unavailable at the moment. Please try again in a few minutes.";
//     }
//     return;
// }

// API-M
export async function getNewAPIToken(callback) {
  if (!idToken || !idToken.length) {
    return null;
  }

  let headers = APIM_HEADERS;
  let grantType =
    encodeURIComponent("grant_type") +
    "=" +
    encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer");
  let assertion =
    encodeURIComponent("assertion") + "=" + encodeURIComponent("idToken");

  let formBody = [grantType, assertion];

  try {
    const fetchResult = fetch(APIM_CLIENT.APIM_TOKEN_ENDPOINT, {
      method: "POST",
      headers: headers,
      body: formBody.join("&"),
    });
    const response = await fetchResult;
    const jsonData = await response.json();

    if (response.ok) {
      if (jsonData) {
        let accessToken = jsonData?.access_token;
        if (accessToken) {
          getNewAPITokenTries = 0;
          setToken(accessToken);
          setAuthError(false);
          callback && callback();
        } else {
          //Checking for callback avoids infinite looping
          if (!callback && getNewAPITokenTries < 4) {
            getNewAPITokenTries++;
            refreshToken();
          }
        }
      }
    } else {
      if (response.status === 400) {
        setAuthError(true);
        console.log("TEST");
      }
      console.error(
        "Error when calling token endpoint! ",
        response.status,
        " ",
        response.statusText
      );

      switch (response.status) {
        case 404:
          return "Looks like the services of the application are under maintenance at the moment. Please try again in a few minutes.";
        case 401:
          return "It seems that the services of the application are temporarily inaccessible. Please contact the Internal Apps Team if this continues.";
        default:
          return "The application seems to have run into an issue! Try reloading the page. Please contact the Internal Apps Team if this continues.";
      }
    }
  } catch (exception) {
    return "Looks like the services of the application are under maintenance or unavailable at the moment. Please try again in a few minutes.";
  }
  return;
}
