import Utils from "../config/utils";
import UserServices from "../services/userServices";
import AuthServices from "../services/authServices.js";
import FormServices from "../services/formServices.js";
import FormSignatureServices from "../services/formSignatureServices.js";
import UserRoleServices from "../services/userRoleServices.js";

export default class RouterStateController {
  async isAuthenticated() {
    const user = Utils.getStore("user");

    // If no user is stored, return false
    if (!user) {
      Utils.setStore("userAuthenticated", false);
      return false;
    }

    try {
      // Always check if the token is valid, regardless of "userAuthenticated"
      const isValidToken = await AuthServices.validateToken(user);

      if (isValidToken.data.isValid) {
        await this.checkAdminPriviledges(); // Ensure privileges are up to date
        return true;
      } else { 
        return false;
      }
    } catch (error) {
      console.log("Token validation failed:", error);
      return false;
    }
  }

  async hasCompletedQuestionnare() {
    const userHasCompletedQuestionnare = Utils.getStore(
      "userHasCompletedQuestionnare",
    );
    const user = Utils.getStore("user");

    if (!userHasCompletedQuestionnare) {
      const userInfo = await UserServices.getUser(user.userId);
      if (userInfo.data.accountUpToDate) {
        Utils.setStore("userHasCompletedQuestionnare", true);
        return true;
      } else return false;
    } else return true;
  }

  async hasSignedForms() {
    const userHasSignedForms = Utils.getStore("userHasSignedForms");
    const user = Utils.getStore("user");

    if (!userHasSignedForms) {
      const numUnsignedForms = await getNumUnsignedForms(user.userId);
      if (numUnsignedForms > 0) {
        return false;
      } else {
        Utils.setStore("userHasSignedForms", true);
        return true;
      }
    } else return true;
  }
}

const getNumUnsignedForms = async (userId) => {
  const formResponse = await FormServices.getAllForms();
  const forms = formResponse.data;
  let unsignedFormCount = 0;

  const signatureResponse =
    await FormSignatureServices.getMostRecentForUser(userId);
  const userSignatures = signatureResponse.data;

  forms.forEach((form) => {
    const currentVersionId = form.formVersions[0].id;
    let isFormSigned = false;

    userSignatures.forEach((signature) => {
      if (signature.formVersionId == currentVersionId) {
        isFormSigned = true;
      }
    });

    if (!isFormSigned) {
      unsignedFormCount++;
    }
  });

  return unsignedFormCount;
};

const checkAdminPriviledges = async () => {
  const user = Utils.getStore("user");

  const response = await UserRoleServices.getAllRolesForUser(user.userId);
  const mappedRoles = response.data.map((currentRole) => {
    return currentRole.role.type;
  });
  const userRoles = mappedRoles;

  if (userRoles.includes("Admin") || userRoles.includes("Director")) {
    Utils.setStore("userHasCompletedQuestionnare", true);
    Utils.setStore("userHasSignedForms", true);
  }
};
