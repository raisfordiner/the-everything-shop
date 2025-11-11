FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy test files
COPY config.json config.docker.json tests.json test_api.py ./

# Make script executable
RUN chmod +x test_api.py

# Run the tests
CMD ["python3", "test_api.py"]
