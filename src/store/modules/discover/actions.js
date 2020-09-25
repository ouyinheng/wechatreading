import * as Svc from "./service.js";

export const reqDiscoverList = ({ commit }) => {
	return Svc.getDiscover().then((res) => {
		commit("setDiscoverList", res);
		return res;
	});
};
