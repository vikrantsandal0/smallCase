exports.fetchPortFolio = (models, attributes, where, include, order, raw = true, nest = true) => {
	const { portfolioModel } = models;
	const finalCond = { attributes, where, include, order, raw, nest };
	return portfolioModel.findAll(finalCond);
};

exports.updatePortfolio = (models, data, where) => {
	const { portfolioModel } = models
	return portfolioModel.update(data, { where });
};