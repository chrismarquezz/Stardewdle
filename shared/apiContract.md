### GET `/word`

Returns the current word of the day, correct guesses, and total guesses.

### Response

```json
{
  "word": "potato",
  "correct_guesses": 43,
  "total_guesses": 102
}

### POST `get`

Validates a user-submitted guess against the word of the day.

```json
{
  "guess": "melon"
}
```json
{
  "result":{"growth_time":"higher","base_price":"higher","regrows":"mismatch","type":"mismatch","season":"match"}
}