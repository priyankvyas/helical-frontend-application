FROM continuumio/miniconda3

WORKDIR /app

COPY environment.yml .
COPY requirements.txt .

# Create a Conda environment with the helical package
RUN conda env create -f environment.yml

SHELL ["conda", "run", "-n", "helical_env", "/bin/bash", "-c"]

# Register a kernel within this environment with the helical tag to use when creating new kernels
RUN python -m ipykernel install --user --name="helical_env" --display-name="Python (Helical)"

RUN pip install -r requirements.txt
COPY . .

CMD flask run --host=0.0.0.0 --port=5001