import os
import sys
import time
import socket
import threading

try:
    import webview
except ImportError:
    print("Please install pywebview: pip install pywebview")
    sys.exit(1)

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def run_django_in_thread(port):
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError("Couldn't import Django.") from exc
    execute_from_command_line(['manage.py', 'runserver', str(port), '--noreload'])

def start_django_server():
    port = 8050
    if is_port_in_use(port):
        print(f"Port {port} is already in use. Assuming Django is running.")
        return None

    print(f"Starting Django server on port {port}...")
    
    server_thread = threading.Thread(target=run_django_in_thread, args=(port,), daemon=True)
    server_thread.start()
    
    for _ in range(50):
        if is_port_in_use(port):
            print("Django server started successfully!")
            return server_thread
        time.sleep(0.1)
        
    print("Warning: Django server did not seem to start in time.")
    return server_thread

if __name__ == '__main__':
    # Determine absolute path for bundled vs normal execution
    if getattr(sys, 'frozen', False):
        base_dir = getattr(sys, '_MEIPASS', os.path.dirname(sys.executable))
    else:
        base_dir = os.path.dirname(os.path.abspath(__file__))

    if base_dir not in sys.path:
        sys.path.insert(0, base_dir)
    os.chdir(base_dir)

    django_thread = start_django_server()
    
    webview.create_window(
        'Math Tug of War', 
        'http://127.0.0.1:8050/',
        width=1280,
        height=800,
        resizable=True,
        min_size=(900, 600)
    )
    
    webview.start()
