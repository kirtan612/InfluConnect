#!/usr/bin/env python3
"""
Test script for Celery automation tasks.
"""
import asyncio
import httpx
import json
from datetime import datetime

# Configuration
API_BASE_URL = "http://localhost:8000/api"
ADMIN_EMAIL = "admin@demo.com"
ADMIN_PASSWORD = "any"  # Demo password

async def get_admin_token():
    """Get admin authentication token."""
    async with httpx.AsyncClient() as client:
        # Login as admin
        login_data = {
            "username": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        
        response = await client.post(
            f"{API_BASE_URL}/auth/admin/login",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code == 200:
            data = response.json()
            return data["access_token"]
        else:
            print(f"❌ Admin login failed: {response.text}")
            return None

async def trigger_task(endpoint, token, task_name):
    """Trigger an automation task."""
    headers = {"Authorization": f"Bearer {token}"}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{API_BASE_URL}/admin/automation/{endpoint}",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {task_name} started")
            print(f"   Task ID: {data['task_id']}")
            print(f"   Status: {data['status']}")
            return data["task_id"]
        else:
            print(f"❌ Failed to start {task_name}: {response.text}")
            return None

async def check_task_status(task_id, token, task_name):
    """Check the status of a task."""
    headers = {"Authorization": f"Bearer {token}"}
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_BASE_URL}/admin/automation/tasks/status/{task_id}",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"📊 {task_name} Status:")
            print(f"   Status: {data['status']}")
            
            if data.get('result'):
                result = data['result']
                print(f"   Message: {result.get('message', 'N/A')}")
                if 'total_processed' in result:
                    print(f"   Processed: {result['total_processed']}")
                if 'updated_count' in result:
                    print(f"   Updated: {result['updated_count']}")
                if 'flagged_count' in result:
                    print(f"   Flagged: {result['flagged_count']}")
            
            if data.get('error'):
                print(f"   Error: {data['error']}")
            
            return data['status']
        else:
            print(f"❌ Failed to get status for {task_name}: {response.text}")
            return None

async def get_active_tasks(token):
    """Get list of active tasks."""
    headers = {"Authorization": f"Bearer {token}"}
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_BASE_URL}/admin/automation/tasks/active",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"🔄 Active Tasks: {data['total_active']}")
            
            for task in data['active_tasks']:
                print(f"   - {task['name']} (ID: {task['id']})")
            
            return data
        else:
            print(f"❌ Failed to get active tasks: {response.text}")
            return None

async def main():
    """Main test function."""
    print("🧪 Testing InfluConnect Automation System")
    print("=" * 50)
    
    # Get admin token
    print("1. Getting admin authentication token...")
    token = await get_admin_token()
    if not token:
        print("❌ Cannot proceed without admin token")
        return
    
    print("✅ Admin token obtained")
    
    # Test all automation endpoints
    tasks_to_test = [
        ("run/trust-score", "Trust Score Recalculation"),
        ("run/suspicious-scan", "Suspicious Account Scan"),
        ("run/inactive-check", "Inactive Influencer Check"),
        ("run/update-completion", "Profile Completion Update")
    ]
    
    task_ids = []
    
    print("\n2. Triggering automation tasks...")
    for endpoint, name in tasks_to_test:
        task_id = await trigger_task(endpoint, token, name)
        if task_id:
            task_ids.append((task_id, name))
        await asyncio.sleep(1)  # Small delay between requests
    
    print(f"\n3. Started {len(task_ids)} tasks")
    
    # Check active tasks
    print("\n4. Checking active tasks...")
    await get_active_tasks(token)
    
    # Wait a bit for tasks to process
    print("\n5. Waiting for tasks to complete...")
    await asyncio.sleep(5)
    
    # Check task statuses
    print("\n6. Checking task results...")
    for task_id, name in task_ids:
        await check_task_status(task_id, token, name)
        print()
    
    # Final active tasks check
    print("7. Final active tasks check...")
    await get_active_tasks(token)
    
    print("\n✅ Automation test completed!")
    print("\nNext steps:")
    print("- Check Flower UI at http://localhost:5555")
    print("- Monitor worker logs in terminal")
    print("- Check database for updated trust scores")

if __name__ == "__main__":
    asyncio.run(main())