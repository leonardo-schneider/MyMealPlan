from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Importa a função de reset só quando o app estiver pronto
        from .jobs import reset_meal_swipes
        from apscheduler.schedulers.background import BackgroundScheduler
        from django_apscheduler.jobstores import DjangoJobStore, register_events

        scheduler = BackgroundScheduler()
        scheduler.add_jobstore(DjangoJobStore(), "default")
        
        try:
            # Configure para executar toda quarta-feira à meia-noite.
            # Alteramos day_of_week para "wed" para quarta-feira.
            scheduler.add_job(
                reset_meal_swipes,
                trigger="cron",
                day_of_week="wed",  # "wed" para quarta-feira
                hour=0,
                minute=0,
                id="reset_meal_swipes",  # ID único para o job
                replace_existing=True,
            )
            register_events(scheduler)
            scheduler.start()
            logger.info("Scheduler started successfully!")
        except Exception as e:
            logger.error("Error starting scheduler job: %s", e)
