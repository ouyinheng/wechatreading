import * as Svc from "./service.js";

export const getRecommList = ({ commit }) => {
	return Svc.getRecommend().then((res) => {
		commit("setRecommList", res.data);
		return res;
	});
};
