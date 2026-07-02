from ui.login import login_screen
from ui.dashboard import dashboard
from utils.session import is_logged_in

login_screen()

if is_logged_in():

    dashboard()