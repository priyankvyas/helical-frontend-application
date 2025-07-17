import json
import os
import re
import uuid

from flask import Flask, request, jsonify
from jupyter_client.manager import KernelManager

app = Flask(__name__)

NOTEBOOK_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'notebooks')

# An in-memory dictionary to store active kernels by session ID
active_kernels = {}

@app.route('/')
def hello():
    return 'Helical Server is running'

# Get the list of notebooks available to the user from the Helical repository
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

# Get the notebook data specified in the API route
@app.route('/api/notebooks/<path:filename>')
def get_notebook_data(filename):
    try:
        base_filename = os.path.basename(filename)
        filepath = os.path.join(NOTEBOOK_DIR, base_filename)

        # Read in the notebook file
        with open(filepath, 'r', encoding = 'utf-8') as f:
            data = json.load(f)

        return jsonify(data), 200
    except FileNotFoundError:
        return jsonify({'error': 'Notebook not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Start a Jupyter kernel
@app.route('/api/kernel/start')
def start_kernel_session():
    try:
        session_id = str(uuid.uuid4())
    
        # Initialize a Kernel Manager to start a Jupyter kernel
        km = KernelManager()
        km.start_kernel()

        # Create a client to communicate with the kernel
        kc = km.client()
        kc.start_channels()

        # Add the kernel to the list of active kernels
        active_kernels[session_id] = {
            'manager': km,
            'client': kc
        }
        
        print(f'Kernel started for session: {session_id}')
        return jsonify({'sessionId': session_id}), 200
    except Exception as e:
        return jsonify({'error': f'Could not start kernel - {str(e)}'}), 500
    
@app.route('/api/kernel/execute', methods=['POST'])
def execute_code():
    data = request.get_json()
    session_id = data.get('sessionId')
    code = data.get('code')

    if session_id not in active_kernels:
        return jsonify({'error': 'Invalid session ID'}), 404
    
    kc = active_kernels[session_id]['client']

    kc.execute(code)

    outputs = []
    while True:
        try:
            msg = kc.get_iopub_msg(timeout = 1)
            print(msg)
            msg_type = msg['header']['msg_type']
            content = msg['content']

            if msg_type == 'error':
                ansi_escape = re.compile(r'\x1b\[[0-9;]*m')
                readable_traceback = [ansi_escape.sub('', line) for line in content['traceback']]
                outputs.append('\n'.join(readable_traceback) + '\n')
            elif msg_type == 'stream':
                outputs.append(content['text'])
            elif msg_type == 'execute_result':
                outputs.append(content['data'].get('text/plain', ''))
            elif msg_type == 'status' and content['execution_state'] == 'idle':
                break
        except Exception as e:
            print(str(e))
            break
    
    return jsonify({'output': ''.join(outputs)}), 200

    
@app.route('/api/kernel/stop', methods=['POST'])
def stop_kernel_session():
    try:
        session_id = request.get_json().get('sessionId')

        # Find the session from the list of active kernels
        if session_id in active_kernels:

            # Get the session manager and shutdown the kernel
            km = active_kernels[session_id]['manager']
            km.shutdown_kernel()
            del active_kernels[session_id]
            print(f'Kernel stopped for session: {session_id}')

            # Return the status indicating that the shutdown was successful
            return jsonify({'status': 'shutdown'}), 200
        return jsonify({'error': 'Invalid session ID'}), 404
    except Exception as e:
        return jsonify({'error': f'Could not stop kernel - {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug = True, port = 5001)