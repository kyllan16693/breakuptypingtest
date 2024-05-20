import os
import random
import hashlib
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Load the files at initialization
base_path = os.path.join(os.getcwd(), 'prompts')
prompt_files = [
    os.path.join(base_path, '1', 'prompts.txt'),
    os.path.join(base_path, '2', 'prompts.txt'),
    os.path.join(base_path, '3', 'prompts.txt'),
    os.path.join(base_path, '4', 'prompts.txt')
]

prompts = []

def load_prompts():
    for file in prompt_files:
        with open(file, 'r') as f:
            prompts.append(f.readlines())

load_prompts()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/prompt')
def get_prompt():
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
