import multiprocessing

bind = "0.0.0.0:8030"
workers = multiprocessing.cpu_count() * 2 + 1
threads = multiprocessing.cpu_count() * 2
timeout = 60

#logging
#accesslog = '/home/gratalot/mutmat/logs/access.log'
#errorlog = '/home/gratalot/mutmat/logs/error.log'

loglevel = 'debug' # most types of information 
capture_output = True
