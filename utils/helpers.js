const kafkaHelper = require("./kafka_helpers");

exports.sendMessagetoExpertiseEventsKafkaTopic = async (accountId, parentAccountId = null, expertiseEventObj) => {
	let kafkaKey;
	// *** Formulate Kakfa key for key based partitioning *** //
	// IF both x-smtip-tid AND x-smtip-sbid in header THEN account_id:sb_id
	// ELSE IF x-smtip-tid in header THEN account_id

	if (!expertiseEventObj) return;

	if (parentAccountId && accountId)
		kafkaKey = `${parentAccountId}:${accountId}`;
	else if (accountId)
		kafkaKey = accountId;

	/** Send the message to the 'expertise-events' topic */
	await kafkaHelper.sendMessageToKafka(
		process.env.IDENTITY_EVENTS_KAFKA_TOPIC, 
		JSON.stringify({
			eventType: expertiseEventObj.event_type,
			payload: {
				id: expertiseEventObj.id,
				src_expertise_id: expertiseEventObj.src_expertise_id,
				des_expertise_id: expertiseEventObj.des_expertise_id,
				event_type: expertiseEventObj.event_type
			}
		}),
		kafkaKey
	);
}