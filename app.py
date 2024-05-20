import os
import random
from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Set the base path to where the prompt files are located
BASE_PATH = os.path.join(os.getcwd(), 'prompts')

# List of prompt file paths
PROMPT_FILES = [
    os.path.join(BASE_PATH, '1', 'prompts.txt'),
    os.path.join(BASE_PATH, '2', 'prompts.txt'),
    os.path.join(BASE_PATH, '3', 'prompts.txt'),
    os.path.join(BASE_PATH, '4', 'prompts.txt')
]

# Initialize an empty list to hold prompts
prompts = []

def load_prompts():
    """Load prompts from the specified files into the prompts list."""
    for file in PROMPT_FILES:
        with open(file, 'r') as f:
            prompts.append(f.readlines())

# Load prompts during application initialization
load_prompts()

@app.route('/')
def home():
    """Render the home page."""
    return render_template('index.html')

@app.route('/prompt')
def get_prompt():
    """
    Generate a random prompt by selecting one random line from each prompt file.

    Returns:
        JSON response with the concatenated prompt and a hex key representing the indices of the selected lines.
    """
    random_indices = [random.randint(0, len(lines) - 1) for lines in prompts]
    random_lines = [prompts[i][index].strip() for i, index in enumerate(random_indices)]
    concatenated_prompt = ' '.join(random_lines)
    
    hex_key = ''.join(f'{index:02x}' for index in random_indices)
    
    return jsonify({
        'prompt': concatenated_prompt,
        'key': hex_key
    })

@app.route('/prompt/<hex_key>')
def get_prompt_from_key(hex_key):
    """
    Retrieve a prompt using a provided hex key.

    Args:
        hex_key (str): A hex string representing the indices of the selected lines.

    Returns:
        JSON response with the concatenated prompt or an error message if the key is invalid.
    """
    indices = [int(hex_key[i:i+2], 16) for i in range(0, len(hex_key), 2)]
    
    if len(indices) != 4 or any(index >= len(prompts[i]) for i, index in enumerate(indices)):
        return jsonify({'error': 'Invalid hex key'}), 400
    
    random_lines = [prompts[i][index].strip() for i, index in enumerate(indices)]
    concatenated_prompt = ' '.join(random_lines)
    
    return jsonify({
        'prompt': concatenated_prompt,
        'key': hex_key
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)