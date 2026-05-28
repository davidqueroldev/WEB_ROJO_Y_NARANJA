# Gunicorn configuration for production
# Start: gunicorn -c gunicorn.conf.py wsgi:app

import multiprocessing

# Bind — puerto interno, Nginx hace de proxy
bind         = "127.0.0.1:8000"
workers      = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
timeout      = 120
keepalive    = 5

# Logging
accesslog  = "/var/log/gunicorn/rojoynaranja_access.log"
errorlog   = "/var/log/gunicorn/rojoynaranja_error.log"
loglevel   = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = "rojoynaranja"

# Daemon (systemd lo gestiona)
daemon = False

# Security
limit_request_line   = 4094
limit_request_fields = 100
