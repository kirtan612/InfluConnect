#!/usr/bin/env python3
"""
Quick start script for InfluConnect with Celery.
Starts all necessary services in development mode.
"""
import os
import sys
import subprocess
import time
from pathlib import Path

def check_redis():
    """Check if Redis is running."""
    try:
        result = subprocess.run(['redis-cli', 'ping'], 
                              capture_output=True, text=True, timeout=5)
        return result.returncode == 0 and 'PONG' in result.stdout
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return False

def start_service(name, command, cwd=None):
    """Start a service in the background."""
    print(f"Starting {name}...")
    try:
        process = subprocess.Popen(
            command, 
            shell=True, 
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        time.sleep(2)  # Give it time to start
        
        if process.poll() is None:  # Still running
            print(f"✅ {name} started successfully (PID: {process.pid})")
            return process
        else:
            stdout, stderr = process.communicate()
            print(f"❌ {name} failed to start")
            print(f"Error: {stderr.decode()}")
            return None
    except Exception as e:
        print(f"❌ Failed to start {name}: {e}")
        return None

def main():
    """Main startup function."""
    print("🚀 Starting InfluConnect with Celery Background Jobs")
    print("=" * 60)
    
    # Check Redis
    print("Checking Redis connection...")
    if not check_redis():
        print("❌ Redis is not running!")
        print("Please start Redis first:")
        print("  - Windows: redis-server")
        print("  - macOS: brew services start redis")
        print("  - Linux: sudo systemctl start redis")
        return 1
    
    print("✅ Redis is running")
    
    # Get current directory
    backend_dir = Path(__file__).parent
    
    # Start services
    processes = []
    
    # 1. Start FastAPI server
    fastapi_process = start_service(
        "FastAPI Server",
        "uvicorn app.main:app --reload --host 0.0.0.0 --port 8000",
        cwd=backend_dir
    )
    if fastapi_process:
        processes.append(("FastAPI", fastapi_process))
    
    # 2. Start Celery Worker
    worker_process = start_service(
        "Celery Worker",
        "celery -A app.tasks.celery_worker worker --loglevel=info --concurrency=2",
        cwd=backend_dir
    )
    if worker_process:
        processes.append(("Celery Worker", worker_process))
    
    # 3. Start Celery Beat
    beat_process = start_service(
        "Celery Beat Scheduler",
        "celery -A app.tasks.celery_worker beat --loglevel=info",
        cwd=backend_dir
    )
    if beat_process:
        processes.append(("Celery Beat", beat_process))
    
    # 4. Start Flower (optional)
    flower_process = start_service(
        "Flower Monitoring",
        "celery -A app.tasks.celery_worker flower --port=5555",
        cwd=backend_dir
    )
    if flower_process:
        processes.append(("Flower", flower_process))
    
    print("\n" + "=" * 60)
    print("🎉 All services started!")
    print("\nAccess URLs:")
    print("  - API Documentation: http://localhost:8000/docs")
    print("  - API Health Check: http://localhost:8000/health")
    print("  - Flower Monitoring: http://localhost:5555")
    print("\nAdmin Automation Endpoints:")
    print("  - POST /api/admin/automation/run/trust-score")
    print("  - POST /api/admin/automation/run/suspicious-scan")
    print("  - POST /api/admin/automation/run/inactive-check")
    print("  - POST /api/admin/automation/run/update-completion")
    print("\nPress Ctrl+C to stop all services")
    print("=" * 60)
    
    try:
        # Wait for keyboard interrupt
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n🛑 Stopping all services...")
        
        for name, process in processes:
            try:
                process.terminate()
                process.wait(timeout=5)
                print(f"✅ Stopped {name}")
            except subprocess.TimeoutExpired:
                process.kill()
                print(f"🔥 Force killed {name}")
            except Exception as e:
                print(f"❌ Error stopping {name}: {e}")
        
        print("👋 All services stopped. Goodbye!")
        return 0

if __name__ == "__main__":
    sys.exit(main())