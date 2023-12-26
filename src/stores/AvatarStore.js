import { defineStore } from "pinia";
import AvatarService from "../services/avatar.service";
import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";
const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const useAvatarStore = defineStore("AvatarStore", {
  state: () => ({
    avatarURL: null,
  }),
  actions: {
    async updateAvatar(data) {
      const updateState = {
        status: null,
        message: null,
      };
      try {
        const message = await AvatarService.updateAvatar(data);
        if (message == "image uploaded") {
          await this.getImageUrlByToken();
          updateState.status = "success";
          updateState.message = "Cập nhật thành công";
          return updateState;
        } else {
          updateState.status = "error";
          updateState.message = "Cập nhật thất bại";
          return updateState;
        }
      } catch (error) {
        console.log(error);
        updateState.status = "error";
        updateState.message = "Lỗi! Cập nhật ảnh đại diện thất bại";
      }
    },

    async getImageUrlByToken() {
      try {
        this.avatarURL = await AvatarService.getImageUrlByToken();
      } catch (e) {
        this.avatarURL = null;
      }
    },
  },
});
