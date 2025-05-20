### GET `/word`

Returns the current word of the day.

### Response

```json
{
  "word": "lewis"
}

### POST `get`

Validates a user-submitted guess against the word of the day.

```json
{
  "guess": "robin"
}
```json
{
  "result": ["gray", "yellow", "green", "gray", "gray"]
}