export async function publishJSON(ch, exchange, routingKey, value) {
    const serializedValue = JSON.stringify(value);
    const buffer = Buffer.from(serializedValue);
    await ch.publish(
        exchange,
        routingKey,
        buffer,
        { contentType: 'application/json'}
    )
}