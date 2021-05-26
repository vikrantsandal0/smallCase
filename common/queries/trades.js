
exports.createTrade = async (models, data) => {
    const { tradesModel } = models;
	const createData = await tradesModel.create(data)
	return createData.get({ plain: true })
};

exports.fetchTrade = (models, attributes, where, include, raw = true) => {
	const { tradesModel } = models;
	const finalCond = { attributes, where, include, raw };
	return tradesModel.findOne(finalCond);
};

exports.updateTrade = (models, data, where) => {
    const { tradesModel } = models
    return  tradesModel.update(data, { where });
};

exports.getAllTradesOfPortfolio = (models, attributes, where, include, raw = true) => {
	const { tradesModel } = models;
	const finalCond = { attributes, where, include, raw };
	return tradesModel.findOne(finalCond);
};