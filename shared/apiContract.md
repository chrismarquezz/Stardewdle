### GET `/word`

Returns the current word of the day.

### Response

```json
{
  "word": "potato"
}

### POST `get`

Validates a user-submitted guess against the word of the day.

```json
{
  "guess": "melon"
}
```json
{
  "result":{"type":"mismatch","regrows":"mismatch","season":"match","growth_time":"higher","base_price":"higher"}
}