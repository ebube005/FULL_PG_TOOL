import logging

def setup_logging():
    formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    # Console handler only
    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    root_logger.handlers = [ch] 