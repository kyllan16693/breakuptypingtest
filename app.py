import os
import random
import hashlib
from flask import Flask, render_template, jsonify

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
    random_lines = [random.choice(lines).strip() for lines in prompts]
    concatenated_prompt = ' '.join(random_lines)
    
    hex_key = hashlib.sha256(concatenated_prompt.encode()).hexdigest()
    
    return jsonify({
        'prompt': concatenated_prompt,
        'key': hex_key
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
