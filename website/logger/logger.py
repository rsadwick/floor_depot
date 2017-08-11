from .models import Log


class Logger():
    def __init__(self, error_type, stacktrace, name, email, phone):
        log = Log(error_type=error_type, stacktrace=stacktrace, name=name,
                  email=email, phone=phone)
        log.save()
