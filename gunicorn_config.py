import multiprocessing

# bind = "127.0.0.1:8000" # django server port, localhost
bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
threads = multiprocessing.cpu_count() * 2
timeout = 60

#logging
accesslog = '/home/nomena/Matostheque_App/logs/access.log'
errorlog = '/home/nomena/Matostheque_App/logs/error.log'

loglevel = 'debug' # most types of information 
capture_output = True

