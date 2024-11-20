# Use Python 3.10 image
FROM python:3.10

# Set working directory
WORKDIR /app

# Copy application files
COPY . /app

# Install dependencies
RUN pip install -r requirements.txt

# Expose port 8080 (Cloud Run's default)
EXPOSE 8080

# Run the app using Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8080", "server:app"]
