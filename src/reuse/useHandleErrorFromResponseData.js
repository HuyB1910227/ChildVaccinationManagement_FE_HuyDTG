import router from "@/router";
export function useHandleErrorFromResponseData() {
  const handleErrorResponseData = (errorResponse) => {
    console.log(errorResponse);
    if (
      errorResponse.path == "/error" &&
      errorResponse.error === "Unauthorized" &&
      errorResponse.status == 401
    ) {
      router.push({ name: "refresh-auth" });
    }
    if (
      errorResponse.path == "/error" &&
      (errorResponse.error === "immunization_unit_is_inactive" ||
        errorResponse.error === "account_is_inactive")
    ) {
      router.push({ name: "error-401" });
    }
  };
  return { handleErrorResponseData };
}
