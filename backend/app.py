import os

from flask import Flask, request, jsonify

app = Flask(__name__)

NOTEBOOK_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'notebooks')

@app.route('/')
def hello():
    return 'Helical Server is running'

@app.route('/api/notebooks')
def get_notebooks():
    try:
        all_files = os.listdir(NOTEBOOK_DIR)
        # Filter to get only the notebook files
        notebook_files = [f for f in all_files if f.endswith('.ipynb')]

        notebooks_data = [{
            'name': os.path.splitext(name)[0].replace('-', ' ').title(),
            'path': name
        } for name in notebook_files]

        return jsonify(notebooks_data), 200
    except FileNotFoundError:
        return jsonify({'error': 'Notebooks directory not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug = True, port = 5001)