from __future__ import unicode_literals
import multiprocessing

bind = "unix:/home/rsadwick/mezzanine/website/gunicorn.sock"
workers = multiprocessing.cpu_count() * 2 + 1
errorlog = "/home/rsadwick/logs/website_error.log"
loglevel = "error"
proc_name = "website"
