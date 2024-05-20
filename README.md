# breakuptypingtest
Breakup typing test



## Endpoints

### GET /

**Description:**  
Renders the home page of the application.

**Example:**  
Navigate to http://localhost:5000 in your web browser to see the home page.

### GET /prompt

**Description:**  
Generates a random prompt by selecting one random line from each of the four prompt files. The response includes the concatenated prompt and a hex key representing the indices of the selected lines.

**Example Request:**
    bash
    curl http://localhost:5000/prompt

**Example Response:**
    json
    {
        "prompt": "Generated prompt from four random lines",
        "key": "hexadecimal_key"
    }

**Response Fields:**
- prompt: The generated prompt created by concatenating one random line from each of the four prompt files.
- key: A hexadecimal string representing the indices of the selected lines.

### GET /prompt/<hex_key>

**Description:**  
Retrieves a prompt using a provided hex key. The hex key encodes the indices of the lines selected from each file.

**Example Request:**
    bash
    curl http://localhost:5000/prompt/0a0b0c0d

**Example Response:**
    json
    {
        "prompt": "Generated prompt corresponding to the provided hex key",
        "key": "0a0b0c0d"
    }

**Error Response:**
    json
    {
        "error": "Invalid hex key"
    }

**Path Parameters:**
- hex_key: A hexadecimal string representing the indices of the selected lines. This key should be exactly 8 characters long (2 characters for each file).

**Response Fields:**
- prompt: The generated prompt created by concatenating the lines specified by the hex key.
- key: The same hex key provided in the request.

**Error Response Fields:**
- error: A message indicating the reason for the error, such as an invalid hex key.