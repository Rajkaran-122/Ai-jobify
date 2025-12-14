"""
Celery Application Configuration for TalentAI Pro
Handles asynchronous task processing for automation workflows
"""
from celery import Celery
import os
from dotenv import load_dotenv

load_dotenv()

# Create Celery app
app = Celery(
    'talentai',
    broker=os.getenv('CELERY_BROKER_URL', 'amqp://guest:guest@localhost:5672//'),
    backend=os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/1'),
    include=[
        'workers.tasks.resume_processing',
        'workers.tasks.matching',
        'workers.tasks.notifications',
    ]
)

# Celery configuration
app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,  # 5 minutes max
    worker_prefetch_multiplier=4,
    worker_max_tasks_per_child=1000,
)

# Task routing
app.conf.task_routes = {
    'workers.tasks.resume_processing.*': {'queue': 'resume'},
    'workers.tasks.matching.*': {'queue': 'matching'},
    'workers.tasks.notifications.*': {'queue': 'notifications'},
}

if __name__ == '__main__':
    app.start()
