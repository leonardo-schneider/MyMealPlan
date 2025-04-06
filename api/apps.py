from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Import the function to reset the meal swipes every wednesday
        from .jobs import reset_meal_swipes
        from apscheduler.schedulers.background import BackgroundScheduler
        from django_apscheduler.jobstores import DjangoJobStore, register_events

        scheduler = BackgroundScheduler()
        scheduler.add_jobstore(DjangoJobStore(), "default")
        
        try:
            #we altered to be every wed at midnight
            scheduler.add_job(
                reset_meal_swipes,
                trigger="cron",
                day_of_week="sun",  
                hour=0,
                minute=0,
                id="reset_meal_swipes",  # ID for the job
                replace_existing=True,
            )
            register_events(scheduler)
            scheduler.start()
            logger.info("Scheduler started successfully!")
        except Exception as e:
            logger.error("Error starting scheduler job: %s", e)
