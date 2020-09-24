import * as Svc from "./service.js";

export const getPictureList = ({ commit }) => {
	return Svc.getPicture().then((res) => {
		commit("setPicList", res);
		return res;
	});
};
