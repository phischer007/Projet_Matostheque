import multiprocessing

bind = "0.0.0.0:8030"

# --- Concurrency ---
cores = multiprocessing.cpu_count()

# Explicitly state the worker class
worker_class = 'gthread'

# Balance workers and threads to avoid memory exhaustion.
# A common pattern is (CPU cores) workers, with 2-4 threads per worker.
workers = cores
threads = 4

# --- Timeouts & Connections ---
timeout = 60
keepalive = 2

# --- Memory Management ---
# Automatically restart workers after serving this many requests
# to prevent memory leaks. The jitter prevents all workers from
# restarting at the exact same time.
max_requests = 1000
max_requests_jitter = 50

loglevel = 'debug'
capture_output = True

# Log access and errors to standard output/error so systemd or Docker can capture them
accesslog = '-'
errorlog = '-'